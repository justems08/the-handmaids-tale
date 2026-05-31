var nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel'),
    list = document.querySelector('.list'), 
    item = document.querySelectorAll('.item'),
    runningTime = document.querySelector('.carousel .timeRunning') 

let timeRunning = 3000 
let fallbackSlideTime = 15000
let slideTimeBuffer = 2500

nextBtn.onclick = function(){
    showSlider('next')
}

prevBtn.onclick = function(){
    showSlider('prev')
}

let runTimeOut 

let runNextAuto


function getActiveSlide() {
    return list.querySelector('.carousel .list .item:first-child')
}

function getActiveSlideTime() {
    const activeSlide = getActiveSlide()
    const activeAudio = activeSlide ? activeSlide.querySelector('audio') : null

    if (activeAudio && Number.isFinite(activeAudio.duration) && activeAudio.duration > 0) {
        const remainingAudioTime = activeAudio.paused
            ? activeAudio.duration
            : Math.max(activeAudio.duration - activeAudio.currentTime, 0)

        return Math.ceil(remainingAudioTime * 1000) + slideTimeBuffer
    }

    return fallbackSlideTime
}

function resetTimeAnimation(duration = fallbackSlideTime) {
    runningTime.style.setProperty('--slide-duration', `${duration}ms`)
    runningTime.style.animation = 'none'
    runningTime.offsetHeight /* trigger reflow */
    runningTime.style.animation = null 
    runningTime.style.animation = 'runningTime var(--slide-duration) linear 1 forwards'
}

function stopSlideAudios() {
    list.querySelectorAll('audio').forEach((audio) => {
        audio.pause()
        audio.currentTime = 0
    })
}

function scheduleNextSlide() {
    clearTimeout(runNextAuto)

    const slideDuration = getActiveSlideTime()
    resetTimeAnimation(slideDuration)

    runNextAuto = setTimeout(() => {
        nextBtn.click()
    }, slideDuration)
}


function showSlider(type) {
    stopSlideAudios()

    let sliderItemsDom = list.querySelectorAll('.carousel .list .item')
    if(type === 'next'){
        list.appendChild(sliderItemsDom[0])
        carousel.classList.add('next')
    } else{
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1])
        carousel.classList.add('prev')
    }

    clearTimeout(runTimeOut)

    runTimeOut = setTimeout( () => {
        carousel.classList.remove('next')
        carousel.classList.remove('prev')
    }, timeRunning)


    scheduleNextSlide()
}

list.querySelectorAll('.carousel .list .item audio').forEach((audio) => {
    audio.addEventListener('loadedmetadata', scheduleNextSlide)
    audio.addEventListener('play', scheduleNextSlide)
    audio.addEventListener('ended', () => {
        clearTimeout(runNextAuto)
        resetTimeAnimation(slideTimeBuffer)
        runNextAuto = setTimeout(() => {
            nextBtn.click()
        }, slideTimeBuffer)
    })
})

// Start the initial animation 
scheduleNextSlide()

const book = document.getElementById("bookToggle");

  book.addEventListener("click", function () {
    book.classList.toggle("open");
  });

const siteHeader = document.querySelector('.site-header');

function updateHeaderSize() {
    if (window.scrollY > 80) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateHeaderSize);
updateHeaderSize();
