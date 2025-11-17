game.stats = true
//game.consoleOverlay.setVisible(true)
const s = sprites.create(img`
    . . 2 2 2 2 . .
    . 2 2 2 2 2 2 .
    2 2 2 2 2 2 2 2
    2 2 2 . . 2 2 2
    2 2 2 . . 2 2 2
    2 2 2 2 2 2 2 2
    . 2 2 2 2 2 2 .
    . . 2 2 2 2 . .
`, SpriteKind.Player)
controller.moveSprite(s)
s.z = 10;
scene.cameraFollowSprite(s)
controller.moveSprite(s)

scene.setBackgroundColor(Math.randomRange(2, 14))

//multilights.addLightSource(s, 10, 10)
//multilights.addFlashLightSource(s, 90, 80, 40)
//multilights.circleLightSourceAttachedTo(s).centerRadius = 5
//multilights.circleLightSourceAttachedTo(s).shiver = 0
multilights.addFlashLightSource(s, 0, 50, 140)
multilights.flashlightSourceAttachedTo(s).shiver = 0
//multilights.circleLightSourceAttachedTo(s).bandWidth = 9.5
multilights.toggleLighting(true)
/*multilights.setShaderRamp(img`
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 1 3 1 5 1 1 1 1 1 1 1 1 1 1
    . 1 1 3 1 5 1 1 1 1 1 1 1 1 1 1
    . 1 1 3 1 5 1 1 1 1 1 1 1 1 1 1
    . 1 1 3 1 5 1 1 7 7 7 7 7 7 7 1
    . 1 1 3 1 5 7 7 1 1 7 7 7 1 1 1
    . 1 1 3 1 7 1 1 7 7 1 1 7 1 1 1
    . 1 1 3 7 5 1 1 1 1 1 7 1 1 1 1
    . 1 1 7 1 5 1 1 1 1 7 1 1 1 1 1
    . 1 7 3 1 5 1 1 1 1 7 1 1 1 1 1
    . 1 7 1 1 1 1 1 1 7 1 1 1 1 1 1
    . 7 1 1 1 1 1 1 7 7 1 1 1 1 1 1
    . 7 1 1 1 1 7 7 1 1 1 1 1 1 1 1
    . 7 1 7 7 7 1 1 1 1 1 1 1 1 1 1
    . 7 7 1 1 1 1 1 1 1 1 1 1 1 1 1
    . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
`)*/

//multilights.addFlashLightSource(s, 0, 40, 40)
scene.setBackgroundImage(image.ofBuffer(hex`e4100400ffff0000d1cb0000a2ff0000b3fc0000e4fc000045ce000086fc000067c80000c8ff000069c80000bafc0000cbff0000fcff0000bdfc0000ceff0000ffff0000`))
let lightEffectOn = true
let direction = 30


controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    //let flashlightSource = multilights.addFlashLightSource(s, 10, direction, 80, 20)

    //multilights.flashlightSourceAttachedTo(s).direction -= 10

    s.x = 81
    s.y = 61
    
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // let flashlightSource = multilights.addFlashLightSource(s, 10, direction, 80, 20)

    //multilights.flashlightSourceAttachedTo(s).direction += 10

    lightEffectOn = !lightEffectOn
    multilights.toggleLighting(lightEffectOn)
    /*let p: Sprite
    p = sprites.createProjectileFromSprite(img`
        2
    `, s, -5, -5)
    multilights.addLightSource(p, 2)
    multilights.circleLightSourceAttachedTo(p).shiver = 0*/
    /*if (lightEffectOn) s.setImage(img`
        . . 2 2 2 . .
        . 2 2 2 2 2 .
        2 2 2 2 2 2 2
        2 2 2 . 2 2 2
        2 2 2 2 2 2 2
        . 2 2 2 2 2 .
        . . 2 2 2 . .
    `)
    else s.setImage(img`
        . . 2 2 2 2 . .
        . 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2
        2 2 2 . . 2 2 2
        2 2 2 . . 2 2 2
        2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 .
        . . 2 2 2 2 . .
    `)*/

})
tiles.setCurrentTilemap(tilemap`level1`)
let glow = 0
forever(()=>{
    glow++
    //multilights.circleLightSourceAttachedTo(s).centerRadius = (Math.sin(glow / 50) * 3) + 7
    //multilights.circleLightSourceAttachedTo(s).bandWidth = (Math.sin(glow / 50) * 3) + 7
    //multilights.circleLightSourceAttachedTo(s).shiver = ((Math.sin(glow / 50)) * 5 | 0) + 4
    multilights.flashlightSourceAttachedTo(s).direction = (Math.sin(glow / 100) * 360) + 90

})
//console.log(s.id)
multilights.setShaderRamp(img`
    . 1 2 3 4 5 6 7 8 9 a b c d e .
    . d 2 d 4 5 8 6 8 6 b c . b e .
    . d a b e 4 8 6 c 6 c c . b c .
    . b c c c 4 c 8 c 6 c . . c c .
    . c . c c e . 8 . 8 . . . . . .
    . c . . . c . c . c . . . . . .
    . . . . . c . . . c . . . . . .
`)

controller.menu.onEvent(ControllerButtonEvent.Pressed, ()=>{
    game.pushScene()
    scene.setBackgroundColor(7)
    //console.log(multilights.MultiLightScreenEffect.getInstance()['sceneNumber'])
    //multilights.toggleLighting(true)
    
    let ss = sprites.create(img`
        2
    `)
    //console.log(ss.id)
    multilights.toggleLighting(lightEffectOn)
    multilights.addLightSource(ss, 5, 5)
    controller.moveSprite(ss)
    multilights.circleLightSourceAttachedTo(ss).shiver = 0
    
    forever(() => {
        glow++
        multilights.circleLightSourceAttachedTo(ss).bandWidth = (Math.sin(glow / 50) * 3) + 5
        //multilights.circleLightSourceAttachedTo(ss).shiver = ((Math.sin(glow / 50) + 1) * 3)
    })

    //game.splash(multilights.MultiLightScreenEffect.getInstance().sceneNumber)
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        lightEffectOn = !lightEffectOn
        multilights.toggleLighting(lightEffectOn)
    })

    controller.menu.onEvent(ControllerButtonEvent.Pressed, () => {
        game.popScene()
        //console.log(multilights.MultiLightScreenEffect.getInstance()['sceneNumber'])
        
    })

})

/*

forever(function() {
    pause(1000)
    if (!sprites.allOfKind(SpriteKind.Player).length) return
    multilights.flashlightSourceAttachedTo(s).darkness = randint(0, 5)
    multilights.flashlightSourceAttachedTo(s).lightRange = randint(0, 100)
    multilights.circleLightSourceAttachedTo(s).centerRadius = randint(0, 15)
    multilights.circleLightSourceAttachedTo(s).bandWidth = randint(0, 4)
    multilights.flashlightSourceAttachedTo(s).angleRange = randint(10, 90)
})*/