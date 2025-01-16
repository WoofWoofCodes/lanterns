const s = sprites.create(sprites.castle.princess2Front, SpriteKind.Player)
controller.moveSprite(s)
s.z = 10;
scene.cameraFollowSprite(s)
controller.moveSprite(s)
const testImages = [
    sprites.castle.skellyAttackFront1,
    sprites.castle.heroWalkFront1,
    sprites.builtin.cat0,
    sprites.builtin.hermitCrabAwaken3,
    sprites.space.spaceAsteroid0,
    sprites.dungeon.chestOpen,
    sprites.dungeon.floorDark0,
    sprites.dungeon.floorLight0,
    sprites.dungeon.greenInnerNorthEast,
    sprites.dungeon.purpleOuterNorthWest
]

scene.setBackgroundColor(Math.randomRange(2, 14))

multilights.addFlashLightSource(s, 0, 80, 60, 10, 0)
multilights.addLightSource(s, 10, 10)
multilights.toggleLighting(true)

scene.setBackgroundImage(image.ofBuffer(hex`e4100400ffff0000d1cb0000a2ff0000b3fc0000e4fc000045ce000086fc000067c80000c8ff000069c80000bafc0000cbff0000fcff0000bdfc0000ceff0000ffff0000`))
let lightEffectOn = true
let direction = 30


controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    //let flashlightSource = multilights.addFlashLightSource(s, 10, direction, 80, 20)

    multilights.flashlightSourceAttachedTo(s).direction -= 10


    // lightEffectOn = !lightEffectOn
    // multilights.toggleLighting(lightEffectOn)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // let flashlightSource = multilights.addFlashLightSource(s, 10, direction, 80, 20)

    multilights.flashlightSourceAttachedTo(s).direction += 10

    // lightEffectOn = !lightEffectOn
    // multilights.toggleLighting(lightEffectOn)
    let p: Sprite
    p = sprites.createProjectileFromSprite(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 3 . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, s, -50, -50)
    multilights.addLightSource(p, 2)
})

tiles.setCurrentTilemap(tilemap`level1`)

pause(1000)
multilights.setShaderRamp(img`
    . 1 2 3 4 5 6 7 8 9 a b c d e .
    . d a b e 4 8 6 c 6 b c . b c .
    . b . c c e c 8 . 8 c . . c . .
    . c . . . c . c . c . . . . . .
    . f 7 e 8 a 4 2 4 2 5 b d c 3 1
    f 5 f f f 4 f f f f f f f f f f
`)


forever(function() {
    pause(1000)
    multilights.flashlightSourceAttachedTo(s).darkness = randint(0, 5)
    multilights.flashlightSourceAttachedTo(s).lightRange = randint(0, 100)
    multilights.circleLightSourceAttachedTo(s).centerRadius = randint(0, 15)
    multilights.circleLightSourceAttachedTo(s).bandWidth = randint(0, 4)
    multilights.flashlightSourceAttachedTo(s).angleRange = randint(10, 90)
})

forever(function () {
    multilights.flashlightSourceAttachedTo(s).direction += 1
})