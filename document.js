document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const stopwatchBtn = document.getElementById('stopwatch-btn');
    const countdownBtn = document.getElementById('countdown-btn');
    const stopwatchControls = document.getElementById('stopwatch-controls');
    const countdownControls = document.getElementById('countdown-controls');
    const display = document.getElementById('display');
    const startStopwatch = document.getElementById('start-stopwatch');
    const resetStopwatch = document.getElementById('reset-stopwatch');
    const presetButtons = document.querySelectorAll('.preset');
    const startCountdown = document.getElementById('start-countdown');
    const pauseCountdown = document.getElementById('pause-countdown');
    const resetCountdown = document.getElementById('reset-countdown');
    const setCustomTime = document.getElementById('set-custom-time');
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    const alarm = document.getElementById('alarm');
    
    // 计时器变量
    let stopwatchInterval;
    let countdownInterval;
    let stopwatchRunning = false;
    let countdownRunning = false;
    let stopwatchTime = 0;
    let countdownTime = 0;
    
    // 切换计时模式
    stopwatchBtn.addEventListener('click', function() {
        stopwatchBtn.classList.add('active');
        countdownBtn.classList.remove('active');
        stopwatchControls.style.display = 'block';
        countdownControls.style.display = 'none';
        resetAllTimers();
    });
    
    countdownBtn.addEventListener('click', function() {
        countdownBtn.classList.add('active');
        stopwatchBtn.classList.remove('active');
        stopwatchControls.style.display = 'none';
        countdownControls.style.display = 'block';
        resetAllTimers();
    });
    
    // 正向计时功能
    startStopwatch.addEventListener('click', function() {
        if (!stopwatchRunning) {
            stopwatchRunning = true;
            startStopwatch.textContent = '暂停';
            stopwatchInterval = setInterval(updateStopwatch, 1000);
        } else {
            stopwatchRunning = false;
            startStopwatch.textContent = '继续';
            clearInterval(stopwatchInterval);
        }
    });
    
    resetStopwatch.addEventListener('click', function() {
        resetStopwatchFunc();
    });
    
    // 倒计时预设按钮
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            countdownTime = minutes * 60;
            updateDisplay(countdownTime);
        });
    });
    
    // 自定义时间设置
    setCustomTime.addEventListener('click', function() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        countdownTime = hours * 3600 + minutes * 60 + seconds;
        updateDisplay(countdownTime);
    });
    
    // 倒计时控制
    startCountdown.addEventListener('click', function() {
        if (countdownTime <= 0) return;
        
        if (!countdownRunning) {
            countdownRunning = true;
            startCountdown.textContent = '继续';
            pauseCountdown.style.display = 'inline-block';
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    });
    
    pauseCountdown.addEventListener('click', function() {
        countdownRunning = false;
        clearInterval(countdownInterval);
        startCountdown.textContent = '开始';
    });
    
    resetCountdown.addEventListener('click', function() {
        resetCountdownFunc();
    });
    
    // 辅助函数
    function updateStopwatch() {
        stopwatchTime++;
        updateDisplay(stopwatchTime);
    }
    
    function updateCountdown() {
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            countdownRunning = false;
            alarm.play();
            return;
        }
        
        countdownTime--;
        updateDisplay(countdownTime);
    }
    
    function updateDisplay(timeInSeconds) {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        
        display.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function resetStopwatchFunc() {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchTime = 0;
        updateDisplay(stopwatchTime);
        startStopwatch.textContent = '开始';
    }
    
    function resetCountdownFunc() {
        clearInterval(countdownInterval);
        countdownRunning = false;
        countdownTime = 0;
        updateDisplay(countdownTime);
        startCountdown.textContent = '开始';
        pauseCountdown.style.display = 'none';
    }
    
    function resetAllTimers() {
        resetStopwatchFunc();
        resetCountdownFunc();
    }
    
    // 初始化显示
    updateDisplay(0);
});