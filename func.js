const grid = document.querySelector(".grid")
const result = document.querySelector(".myH1")
const easyBtn = document.getElementById("easy")
const hardBtn = document.getElementById("hard")
const nightmareBtn = document.getElementById("nightmare")
const container = document.getElementById("container")
let direction = -1

grid.style.display = "none"

const creatDiv = () => {
    for(let i = 0; i < 1800; i++){
        const square = document.createElement(`div`)
        square.classList.add("square")
        grid.appendChild(square)
    }
}    


let squares = []
const creatSquare = () => {
    squares = Array.from(document.querySelectorAll(".square"))
} //

let alienInvaders = [
                                 7,8,
                              66,67,68,69, 
    121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,134, 135,136,137,138,139,140,141,142,143,144,145,
         182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 
                244, 245, 246, 247, 248, 249, 250, 251, 
           303, 304, 305, 306, 307, 308, 309, 310, 311, 312,
        362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373,
    421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434,
                   484, 485, 486,          489, 490, 491, 
          542, 543, 544,                                551, 552, 553,
    601, 602, 603,                                         612, 613, 614,
    661, 662,                                                    673, 674,
    721,                                                                734
]

let laserSquare = []
let userPositon = 1650
const creatSquareUser = () => {
    squares[userPositon].classList.add("user")
}
const drawAlien = () => {
    for(let i = 0; i<alienInvaders.length; i++){
        squares[alienInvaders[i]]?.classList.add("alien")
    }
}

const removeAlien = () => {
    for(let i = 0; i<alienInvaders.length; i++){
        squares[alienInvaders[i]]?.classList.remove("alien")
    }
}
const width = 60
const userMove = (e) => {
    let leftEdge = userPositon % width === 0
    let rightEdge = userPositon % width === width - 1
        squares[userPositon].classList.remove("user")
        switch (e.key){
            case 'a': 
                if(!leftEdge)
                    userPositon -= 1
                    break
            case 'A': 
                if(!leftEdge)
                    userPositon -= 1
                    break
            case 'd': 
                if(!rightEdge)
                    userPositon++
                    break
            case 'D': 
                if(!rightEdge)
                    userPositon++
                    break
        }
    squares[userPositon].classList.add("user")
        
}


const alienMove = () => {
    if(alienInvaders.length === 0) winGame()
    removeAlien()
    let leftEdge = alienInvaders.some(invader => invader % width === 0)
    let rightEdge = alienInvaders.some(invader => invader % width === width - 1)
    if(leftEdge||rightEdge){
        direction *= -1
        for (let j = 0; j < alienInvaders.length; j++) {
            alienInvaders[j] += width
        }
    }
    for (let i = 0; i < alienInvaders.length; i++) {
        
        alienInvaders[i] += direction
    }
    drawAlien()
    if(alienInvaders.some(invader => invader >= squares.length)) {
        loseGame()
        console.log("thua")
    }
}

// laser
let shootLastPress = 0
const shoot = (e) => {
    
    if(e.key !== 'k' && e.key !== 'K') return
    if(Date.now() - shootLastPress < 120) return
    shootLastPress = Date.now()
    console.log(userPositon)
    const laserPosition = userPositon - width
    laserSquare.push(laserPosition)
    console.log(laserSquare)
}


const drawLaser = () => {
    if(laserSquare.length === 0 ) {
        return
    }
    for (let i = 0; i < laserSquare.length; i++) {
        
        if(laserSquare[i]<0){
            laserSquare.splice(i, 1)
            continue
        }    
        console.log(laserSquare[i])
        const laserDiv = squares[laserSquare[i]]
        laserDiv.classList.add("laserDiv")                                      /// classList.add trả về undefined
        // const laser = document.createElement(`div`)
        // laserDiv.appendChild(laser)
        // laser.classList.add("laser")     
    }
}
const removeLaser = () => {
    if(laserSquare.length === 0 ) return
    for (let i = 0; i < laserSquare.length; i++) {
        if(laserSquare[i]<0){
            laserSquare.splice(i, 1)
            continue
        }   
        squares[laserSquare[i]].classList.remove("laserDiv")
    }
}
const moveLaser = () => {
    removeLaser()
    for (let i = 0; i < laserSquare.length; i++) {
        laserSquare[i] -= width
        if(laserSquare[i]<0){
            laserSquare.splice(i, 1)
            continue
        } 
        if(squares[laserSquare[i]].classList.contains('alien')) getHit(laserSquare[i])
    }
    drawLaser()
}

const getHit = (alienPosition) => {
    let  i = alienInvaders.indexOf(alienPosition)
    let j = laserSquare.indexOf(alienPosition)
    console.log("alien at: "+ alienPosition)
    console.log(i)
    squares[alienInvaders[i]].classList.remove("alien")
    squares[alienInvaders[i]].classList.add("alienDead")
    if(i !== -1) alienInvaders.splice(i,1)              // thêm điều kiện mặc dù splice sẽ không xóa index không hợp lệ????
    if(j !== -1) laserSquare.splice(j,1) 
    if(alienInvaders.length === 0) winGame()   
}
const checkLose = () => {
    if(squares[userPositon].classList.contains("alien")) {
        loseGame() 
        console.log("checklose")
    }
}
let intervalId

const winGame = () => {
    clearInterval(intervalId)
    result.innerHTML = "Congratulations you win!"
}
const loseGame = () => {
    clearInterval(intervalId)
    result.innerHTML = "You lose."
}
const speeds = { easy: 100, hard: 70, nightmare: 1 };

easyBtn.addEventListener("click", () => startGame(speeds.easy));
hardBtn.addEventListener("click", () => startGame(speeds.hard));
nightmareBtn.addEventListener("click", () => startGame(speeds.nightmare));

const startGame = (speed) => {
    container.style.display = "none";
    grid.style.display = "block";

    creatDiv();
    creatSquare();
    creatSquareUser();
    drawAlien();
    document.addEventListener('keydown', userMove);
    document.addEventListener("keydown", shoot);

    intervalId = setInterval(() => {
        alienMove();
        moveLaser();
        checkLose();
    }, speed);
};