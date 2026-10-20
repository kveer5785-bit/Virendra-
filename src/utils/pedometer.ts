/**
 * PulseFit Pedometer & Motion Sensor Engine
 * Works with real mobile accelerometer when available, plus fallback walker simulation.
 */

export interface StepMotionCallback {
  onStep: (stepCount: number) => void;
  onCadenceUpdate?: (cadenceSpm: number) => void;
}

export class PedometerEngine {
  private isListening = false;
  private lastStepTimestamp = 0;
  private stepTimestamps: number[] = [];
  private stepCount = 0;
  private callback: StepMotionCallback | null = null;
  private simulationInterval: number | null = null;
  private motionHandler: ((event: DeviceMotionEvent) => void) | null = null;

  constructor(initialSteps = 0) {
    this.stepCount = initialSteps;
  }

  public setStepCount(steps: number) {
    this.stepCount = steps;
  }

  public getStepCount() {
    return this.stepCount;
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
   * Start listening to device accelerometer
   */
  public start(callback: StepMotionCallback) {
    this.callback = callback;
    this.isListening = true;

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      let lastMagnitude = 9.8;
      const threshold = 2.4; // Acceleration peak threshold in m/s² above gravity

      this.motionHandler = (event: DeviceMotionEvent) => {
        if (!this.isListening) return;

        const acc = event.accelerationIncludingGravity;
        if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

        const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
        const delta = Math.abs(magnitude - lastMagnitude);
        lastMagnitude = magnitude;

        const now = Date.now();
        // Step filter: delta exceeds threshold and at least 280ms since previous step (max 214 spm)
        if (delta > threshold && now - this.lastStepTimestamp > 280) {
          this.lastStepTimestamp = now;
          this.stepCount += 1;
          this.recordStepTime(now);

          if (this.callback) {
            this.callback.onStep(this.stepCount);
          }
        }
      };

      try {
        window.addEventListener('devicemotion', this.motionHandler, { passive: true });
      } catch (e) {
        console.warn('Failed to bind devicemotion:', e);
      }
    }
  }

  /**
   * Start a smooth real-time walking simulator (e.g. for desktop or stationary testing)
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
