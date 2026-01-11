class WorkoutTimer {
    constructor() {
        this.workTime = 180;
        this.restTime = 60;
        this.currentTime = this.workTime;
        this.isWorkMode = true;
        this.isRunning = false;
        this.intervalId = null;
        this.cycleCount = 0;

        this.initElements();
        this.initEventListeners();
        this.updateDisplay();
    }

    initElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.statusDisplay = document.getElementById('current-status');
        this.workTimeInput = document.getElementById('work-time');
        this.restTimeInput = document.getElementById('rest-time');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.cycleCountDisplay = document.getElementById('cycle-count');
        this.body = document.body;
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.workTimeInput.addEventListener('change', (e) => {
            this.workTime = parseInt(e.target.value) || 180;
            if (!this.isRunning) {
                this.currentTime = this.workTime;
                this.updateDisplay();
            }
        });

        this.restTimeInput.addEventListener('change', (e) => {
            this.restTime = parseInt(e.target.value) || 60;
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.workTimeInput.disabled = true;
            this.restTimeInput.disabled = true;

            this.intervalId = setInterval(() => this.tick(), 1000);
        }
    }

    reset() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        clearInterval(this.intervalId);
        this.isWorkMode = true;
        this.currentTime = this.workTime;
        this.cycleCount = 0;
        this.workTimeInput.disabled = false;
        this.restTimeInput.disabled = false;
        this.updateDisplay();
        this.updateStatus();
        this.updateCycleCount();
    }

    tick() {
        this.currentTime--;

        if (this.currentTime < 0) {
            this.playSound();
            this.switchMode();
        }

        this.updateDisplay();
    }

    switchMode() {
        if (this.isWorkMode) {
            this.isWorkMode = false;
            this.currentTime = this.restTime;
            this.cycleCount++;
            this.updateCycleCount();
        } else {
            this.isWorkMode = true;
            this.currentTime = this.workTime;
        }
        this.updateStatus();
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;

        this.minutesDisplay.textContent = String(minutes).padStart(2, '0');
        this.secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    updateStatus() {
        if (this.isWorkMode) {
            this.statusDisplay.textContent = '운동 시간';
            this.statusDisplay.classList.remove('rest-mode');
            this.body.classList.remove('rest-mode');
            this.body.classList.add('work-mode');
        } else {
            this.statusDisplay.textContent = '휴식 시간';
            this.statusDisplay.classList.add('rest-mode');
            this.body.classList.remove('work-mode');
            this.body.classList.add('rest-mode');
        }
    }

    updateCycleCount() {
        this.cycleCountDisplay.textContent = this.cycleCount;
    }

    playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

const timer = new WorkoutTimer();
