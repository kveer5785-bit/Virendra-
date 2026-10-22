/**
 * PulseFit Pedometer & Motion Sensor Engine
 * Optimized for mobile touch, Android & iOS browser sensors, and Screen Wake Lock.
 */

export interface StepMotionCallback {
  onStep: (stepCount: number) => void;
  onCadenceUpdate?: (cadenceSpm: number) => void;
  onError?: (errorMessage: string) => void;
}

export class PedometerEngine {
  private isListening = false;
  private lastStepTimestamp = 0;
  private stepTimestamps: number[] = [];
  private stepCount = 0;
  private callback: StepMotionCallback | null = null;
  private simulationInterval: number | null = null;
  private motionHandler: ((event: DeviceMotionEvent) => void) | null = null;
  
  // Gravity isolation filter states
  private gravity = { x: 0, y: 9.8, z: 0 };
  private alpha = 0.8; // Low-pass filter coefficient for gravity
  private stepThreshold = 2.0; // Dynamic acceleration peak threshold in m/s²
  private minStepIntervalMs = 280; // Max cadence ~214 steps/min
  
  // Screen Wake Lock handle (prevents mobile screen timeout during active walking)
  private wakeLockSentinel: unknown = null;

  constructor(initialSteps = 0) {
    this.stepCount = initialSteps;
  }

  public setStepCount(steps: number) {
    this.stepCount = steps;
  }

  public getStepCount() {
    return this.stepCount;
  }

  public getIsListening() {
    return this.isListening;
  }

  /**
   * Request motion permission (Required for iOS 13+ Safari/Chrome)
   */
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check if DeviceMotionEvent requires permission on iOS
    const dme = window.DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof dme?.requestPermission === 'function') {
      try {
        const response = await dme.requestPermission();
        return response === 'granted';
      } catch (err) {
        console.warn('DeviceMotionEvent permission error:', err);
        return false;
      }
    }

    // Android and standard desktop browsers do not require explicit requestPermission call
    return true;
  }

  /**
   * Request Screen Wake Lock so mobile screen stays awake during walking workout
   */
  public async requestWakeLock(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        const nav = navigator as unknown as {
          wakeLock: {
            request: (type: 'screen') => Promise<unknown>;
          };
        };
        this.wakeLockSentinel = await nav.wakeLock.request('screen');
        return true;
      } catch (err) {
        console.warn('Screen Wake Lock request failed:', err);
        return false;
      }
    }
    return false;
  }

  public releaseWakeLock() {
    if (this.wakeLockSentinel) {
      try {
        const sentinel = this.wakeLockSentinel as { release?: () => Promise<void> };
        sentinel.release?.();
      } catch (e) {
        console.warn('Error releasing wake lock:', e);
      }
      this.wakeLockSentinel = null;
    }
  }

  /**
   * Start listening to device accelerometer with gravity separation
   */
  public start(callback: StepMotionCallback) {
    this.callback = callback;
    this.isListening = true;

    // Try to acquire Wake Lock to prevent phone screen sleep while walking
    this.requestWakeLock();

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      this.motionHandler = (event: DeviceMotionEvent) => {
        if (!this.isListening) return;

        const rawAcc = event.accelerationIncludingGravity;
        if (!rawAcc || rawAcc.x === null || rawAcc.y === null || rawAcc.z === null) return;

        // 1. Isolate gravity using low-pass filter
        this.gravity.x = this.alpha * this.gravity.x + (1 - this.alpha) * rawAcc.x;
        this.gravity.y = this.alpha * this.gravity.y + (1 - this.alpha) * rawAcc.y;
        this.gravity.z = this.alpha * this.gravity.z + (1 - this.alpha) * rawAcc.z;

        // 2. Linear acceleration without gravity
        const linX = rawAcc.x - this.gravity.x;
        const linY = rawAcc.y - this.gravity.y;
        const linZ = rawAcc.z - this.gravity.z;

        // 3. Vector magnitude
        const linearMagnitude = Math.sqrt(linX * linX + linY * linY + linZ * linZ);

        const now = Date.now();
        // 4. Refractory step detection filter
        if (linearMagnitude > this.stepThreshold && now - this.lastStepTimestamp > this.minStepIntervalMs) {
          this.lastStepTimestamp = now;
          this.stepCount += 1;
          this.recordStepTime(now);

          // Subtle Android haptic feedback if supported
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate(8);
            } catch {
              // Ignore haptic errors on unsupported devices
            }
          }

          if (this.callback) {
            this.callback.onStep(this.stepCount);
          }
        }
      };

      try {
        window.addEventListener('devicemotion', this.motionHandler, { passive: true });
      } catch (e) {
        console.warn('Failed to bind devicemotion:', e);
        this.callback?.onError?.('Accelerometer sensor not accessible in current context.');
      }
    } else {
      this.callback?.onError?.('Device motion sensor not supported in this browser.');
    }
  }

  /**
   * Start a smooth real-time walking simulator (for desktop or testing)
   */
  public startSimulation(intervalMs = 950) {
    if (this.simulationInterval) return;

    this.simulationInterval = window.setInterval(() => {
      this.stepCount += 2;
      const now = Date.now();
      this.recordStepTime(now);
      this.recordStepTime(now - 450);

      if (this.callback) {
        this.callback.onStep(this.stepCount);
      }
    }, intervalMs);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public isSimulating() {
    return this.simulationInterval !== null;
  }

  private recordStepTime(timestamp: number) {
    this.stepTimestamps.push(timestamp);
    // Keep last 15 seconds for cadence calculation
    const cutoff = timestamp - 15000;
    this.stepTimestamps = this.stepTimestamps.filter(t => t > cutoff);

    if (this.callback?.onCadenceUpdate && this.stepTimestamps.length >= 2) {
      const windowSeconds = (timestamp - this.stepTimestamps[0]) / 1000;
      if (windowSeconds > 1) {
        const cadence = Math.round((this.stepTimestamps.length / windowSeconds) * 60);
        this.callback.onCadenceUpdate(Math.min(cadence, 240));
      }
    }
  }

  public stop() {
    this.isListening = false;
    this.stopSimulation();
    this.releaseWakeLock();

    if (this.motionHandler && typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', this.motionHandler);
      this.motionHandler = null;
    }
  }

  public static calculateDistanceKm(steps: number, strideLengthMeters = 0.76): number {
    return Number(((steps * strideLengthMeters) / 1000).toFixed(2));
  }

  public static calculateCaloriesBurned(steps: number, weightKg = 70): number {
    // Metabolic equivalent calculation: ~0.042 kcal per step for 70kg individual
    const factor = (weightKg / 70) * 0.042;
    return Math.round(steps * factor);
  }
}
