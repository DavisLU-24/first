document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const stopwatchBtn = document.getElementById('stopwatch-btn');
    const countdownBtn = document.getElementById('countdown-btn');
    const stopwatchControls = document.getElementById('stopwatch-controls');
    const countdownControls = document.getElementById('countdown-controls');
    const display = document.getElementById('display');
    const timeParts = document.querySelectorAll('.time-part');
    const startStopwatch = document.getElementById('start-stopwatch');
    const resetStopwatch = document.getElementById('reset-stopwatch');
    const presetBtns = document.querySelectorAll('.preset-btn');
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
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        countdownBtn.classList.remove('active');
        stopwatchControls.style.display = 'flex';
        countdownControls.style.display = 'none';
        resetAllTimers();
        
        // 添加动画效果
        animateButton(this);
    });
    
    countdownBtn.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        stopwatchBtn.classList.remove('active');
        stopwatchControls.style.display = 'none';
        countdownControls.style.display = 'flex';
        resetAllTimers();
        
        // 添加动画效果
        animateButton(this);
    });
    
    // 正向计时功能
    startStopwatch.addEventListener('click', function() {
        if (!stopwatchRunning) {
            stopwatchRunning = true;
            startStopwatch.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <span>暂停</span>
            `;
            stopwatchInterval = setInterval(updateStopwatch, 1000);
        } else {
            stopwatchRunning = false;
            startStopwatch.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <span>继续</span>
            `;
            clearInterval(stopwatchInterval);
        }
        
        animateButton(this);
    });
    
    resetStopwatch.addEventListener('click', function() {
        resetStopwatchFunc();
        animateButton(this);
    });
    
    // 倒计时预设按钮
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            countdownTime = minutes * 60;
            updateDisplay(countdownTime);
            
            // 高亮选中按钮
            presetBtns.forEach(b => b.style.boxShadow = 'none');
            this.style.boxShadow = `0 0 0 2px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}`;
            
            animateButton(this);
        });
    });
    
    // 自定义时间设置
    setCustomTime.addEventListener('click', function() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        countdownTime = hours * 3600 + minutes * 60 + seconds;
        updateDisplay(countdownTime);
        
        // 移除预设按钮高亮
        presetBtns.forEach(b => b.style.boxShadow = 'none');
        
        animateButton(this);
    });
    
    // 倒计时控制
    startCountdown.addEventListener('click', function() {
        if (countdownTime <= 0) {
            showAlert('请先设置倒计时时间');
            return;
        }
        
        if (!countdownRunning) {
            countdownRunning = true;
            startCountdown.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <span>暂停</span>
            `;
            pauseCountdown.style.display = 'block';
            countdownInterval = setInterval(updateCountdown, 1000);
        }
        
        animateButton(this);
    });
    
    pauseCountdown.addEventListener('click', function() {
        countdownRunning = false;
        clearInterval(countdownInterval);
        startCountdown.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <span>继续</span>
        `;
        
        animateButton(this);
    });
    
    resetCountdown.addEventListener('click', function() {
        resetCountdownFunc();
        animateButton(this);
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
            startCountdown.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <span>开始</span>
            `;
            alarm.play();
            showAlert('时间到！');
            return;
        }
        
        countdownTime--;
        updateDisplay(countdownTime);
    }
    
    function updateDisplay(timeInSeconds) {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        
        timeParts[0].textContent = hours.toString().padStart(2, '0');
        timeParts[1].textContent = minutes.toString().padStart(2, '0');
        timeParts[2].textContent = seconds.toString().padStart(2, '0');
    }
    
    function resetStopwatchFunc() {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchTime = 0;
        updateDisplay(stopwatchTime);
        startStopwatch.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <span>开始</span>
        `;
    }
    
    function resetCountdownFunc() {
        clearInterval(countdownInterval);
        countdownRunning = false;
        countdownTime = 0;
        updateDisplay(countdownTime);
        startCountdown.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <span>开始</span>
        `;
        pauseCountdown.style.display = 'none';
        presetBtns.forEach(b => b.style.boxShadow = 'none');
    }
    
    function resetAllTimers() {
        resetStopwatchFunc();
        resetCountdownFunc();
    }
    
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = 'scale(1)', 150);
    }
    
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert-message';
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 2000);
    }
    
    // 初始化显示
    updateDisplay(0);
});