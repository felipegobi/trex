var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  Restart = loadImage("restart.png");
  groundImage = loadImage("ground2.png");
  gameOver = loadImage("gameOver.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  dieSound = loadSound("die.mp3")
  checkpoint = loadSound("checkpoint.mp3")
  jumpSound = loadSound ("jump.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  FimDeJogo = createSprite(width/2, height/2)
  FimDeJogo.addImage(gameOver)
  FimDeJogo.scale=2
  restart = createSprite(width/2, height/2+40)
  restart.addImage(Restart)
  restart.scale = 0.5
  trex = createSprite(50,height - 20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.debug = false 
  trex.setCollider("circle", 0, 0, 40)
  ground = createSprite(200,height - 20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -3;
  
  invisibleGround = createSprite(200,height - 10,400,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(180);
  text("Score: "+ score, width/2,50);
 
  if(score>0 && score%100 === 0){
     checkpoint.play();
  }
  if(gameState === PLAY){
    //mover o solo
    score = score + Math.round(frameRate()/20);
    FimDeJogo.visible = false
    restart.visible = false
    ground.velocityX = -(4 + 3 * score / 100)
    spawnClouds();
    spawnObstacles();
    if((touches.length>0 ||keyDown("space"))&& trex.y >= height - 50) {
      trex.velocityY = -13;
      jumpSound.play(); 
      touches = []
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END
      dieSound.play();
    }
    }
  }
  else if(gameState === END){
    //parar o solo
    FimDeJogo.visible = true
    restart.visible = true
    ground.velocityX = 0;
trex.velocityX=0
    obstaclesGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setVelocityXEach(0)
    cloudsGroup.setLifetimeEach(-1)
  trex.changeAnimation('collided', trex_collided)
  }
   if(touches.lenght>0 ||mousePressedOver(restart)){
     reset() 
     touches=[]
   }
  
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  //gere as nuvens
  
  
  //gere obstáculos no solo
  
  
  drawSprites();
}
function reset (){
gameState = PLAY 
obstaclesGroup.destroyEach()
score=0
trex.changeAnimation("running", trex_running)
cloudsGroup.destroyEach()
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height - 35,10,40);
   obstacle.velocityX = -(3 + score /100)

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width + 20,height/2,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -( + score /100)
    
     //atribuir vida útil à variável
    cloud.lifetime = 134;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}
