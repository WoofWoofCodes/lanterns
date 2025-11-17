//% icon="\uf185" color="#8f1fff"
namespace multilights {
    // The top row is just the palette, each row gets darker //pins //Multilights

    const palette_ramps = image.ofBuffer(hex`e4100400ffff0000d1cb0000a2ff0000b3fc0000e4fc000045ce000086fc000067c80000c8ff000069c80000bafc0000cbff0000fcff0000bdfc0000ceff0000ffff0000`);
    const paletteRampBuffer = Buffer.create(16 * 16)
    for (let shadeLevel = 0; shadeLevel < palette_ramps.height; shadeLevel++) {
        for (let i = 0; i < 16; i++) {
            paletteRampBuffer[shadeLevel * 16 + i] = palette_ramps.getPixel(i, shadeLevel)
        }
    }
    /* const palette_ramps = img`
        . 1 2 3 4 5 6 7 8 9 a b c d e .
        . d a b e 4 8 6 c 6 b c . b c .
        . b . c c e c 8 . 8 c . . c . .
        . c . . . c . c . c . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    ` */ // image version of the above buffer for those that want to see it

    let stateStack: LanternsState[]

    export function _state() {
        _init();
        return stateStack[stateStack.length - 1];
    }

    export function _init() {
        if (stateStack) return;

        stateStack = [
            new LanternsState
        ]

        game.addScenePushHandler(() => {
            stateStack.push(new LanternsState())
        })

        game.addScenePopHandler(() => {
            stateStack.pop()

            if (stateStack.length === 0) {
                stateStack.push(new LanternsState());
            }
        })
    }
    

    export class LanternsState {

        private lightSourceMap: { [id: string]: lightsource.LightSource; } = {}
        private flashlightSourceMap: { [id: string]: lightsource.FlashlightLightSource; } = {}
        private _init: boolean = false
        private _running = false;
        private renderable: scene.Renderable
        
        constructor() {
            this._init = false;
        }

        get running() {
            return this._running
        }

        set running(running: boolean) {
            if (running && !this._init) {
                this.startScreenEffect()
            }
            this._running = running
        }

        bandWidthOfSprite(sprite: Sprite, bandWidth: number) {
            let lightSource = this.lightSourceMap[sprite.id]
            lightSource.setBandWidth(bandWidth)
        }

        removeLightSource(sprite: Sprite) {
            delete this.lightSourceMap[sprite.id]
        }

        removeFlashlightSource(sprite: Sprite) {
            delete this.flashlightSourceMap[sprite.id]
        }

        getFlashlight(sprite: Sprite) {
            return this.flashlightSourceMap[sprite.id] as lightsource.FlashlightLightSource
        }

        getCircleLight(sprite: Sprite) {
            return this.lightSourceMap[sprite.id] as lightsource.CircleLightSource
        }

        startScreenEffect() {
            if (this._init) {
                return
            }

            this.renderable = scene.createRenderable(91, () => {
                //console.log("running")
                if (!this._running) {
                    return;
                }

                // 0. prepare a empty light map with radius 0
                let lightMap = image.create(screen.width, screen.height)
                lightMap.fill(15)
                
                // 1. prepare light map for each light source
                for (const key of Object.keys(this.lightSourceMap)) {
                    let lightsource = this.lightSourceMap[key]
                    lightsource.apply(lightMap)
                }
                for (const key of Object.keys(this.flashlightSourceMap)) {
                    let lightsource = this.flashlightSourceMap[key]
                    lightsource.apply(lightMap)
                }

                // 2. apply light map to screen
                
                //screen.drawTransparentImage(lightMap, 0, 0) // for testing
                helpers.mapImage(screen, lightMap, 0, 0, paletteRampBuffer)
            })

            this._init = true
        }

        addFlashLightSource(sprite: Sprite, bandWidth: number, direction: number, lightRange: number, angleRange: number, darkness: number, shiver: number): lightsource.FlashlightLightSource {
            let newLightSource = this.flashlightSourceMap[sprite.id]

            if (!newLightSource) {
                newLightSource = new lightsource.FlashlightLightSource(sprite, bandWidth, direction, lightRange, angleRange, darkness, shiver)
                this.flashlightSourceMap[sprite.id] = newLightSource
                
                sprite.onDestroyed(function () { 
                    removeLightSource(sprite)
                    removeFlashlightSource(sprite)
                })
            }
            

            return newLightSource as lightsource.FlashlightLightSource
        }

        addLightSource(sprite: Sprite, bandWidth: number, centerRadius: number, shiver: number): lightsource.CircleLightSource {
            let newLightSource = this.lightSourceMap[sprite.id]
            
            if (!newLightSource) {
                newLightSource = new lightsource.CircleLightSource(sprite, bandWidth, 4, centerRadius, shiver)
                this.lightSourceMap[sprite.id] = newLightSource 

                sprite.onDestroyed(function () {
                    removeLightSource(sprite)
                    removeFlashlightSource(sprite)
                })
            }


            return newLightSource as lightsource.CircleLightSource
        }

        setColorRamp(ramp: Image) {
            for (let shadeLevel = 0; shadeLevel < ramp.height; shadeLevel++) {
                for (let i = 0; i < 16; i++) {
                    paletteRampBuffer[shadeLevel * 16 + i] = ramp.getPixel(i, shadeLevel)
                }
            }
        }
    }

    //%block
    export function toggleLighting(on: boolean) {
        if (on) {
            _state().running = true
        } else {
            _state().running = false
        }
    }

    //%block
    export function lightingIsOn() {
        return _state().running
    }

    //%block
    //%group="Circlelight"
    //%blockid=multilightRemoveLightSource block="remove light source from %sprite=variables_get(mySprite) "
    export function removeLightSource(sprite: Sprite) {
        _state().removeLightSource(sprite)
    }

    //%block
    //%group="Flashlight"
    //%blockid=multilightRemoveFlashlightSource block="remove flashlight source from %sprite=variables_get(mySprite) "
    export function removeFlashlightSource(sprite: Sprite) {
        _state().removeFlashlightSource(sprite)
    }

    //%block
    //%group="Circlelight"
    //%blockid=multilightAddLightSource block="attach circleLight to %sprite=variables_get(mySprite) bandWidth %bandWidth centerRadius %centerRadius shiver %shiver"
    //%bandWidth.defl=4
    //%centerRadius.defl=1
    //%shiver.defl=2.5
    export function addLightSource(sprite: Sprite, bandWidth: number = 4, centerRadius: number = 1, shiver: number = 2.5) {
        _state().addLightSource(sprite, bandWidth, centerRadius, shiver)
    }

    //%block
    //%blockid=multilightSetShaderRamp block="set Shader Ramp to %picture=variables_get(picture)"
    export function setShaderRamp(ramp: Image) {
        _state().setColorRamp(ramp)
    }

    //%block
    //%group="Flashlight"
    //%blockid=multilightAddFlashlightSource block="attach flashlight to %sprite=variables_get(mySprite) direction %direction lightRange %lightRange angleRangle %angleRange darkness %darkness shiver %shiver"
    //%direction.defl=0
    //%lightRange.defl=32
    //%angleRange.defl=30
    //%darkness.defl=0
    //%shiver.defl=2.5
    export function addFlashLightSource(sprite: Sprite, direction: number, lightRange: number, angleRange: number, darkness: number = 0, shiver: number = 2.5, bandWidth: number = 5) {
        _state().addFlashLightSource(sprite, bandWidth, direction, lightRange, angleRange, darkness, shiver)
    }

    //%block
    //%group="Flashlight"
    //%blockid=multilightGetFlashlightSourceAttachedTo block="flashlight attached to %sprite=variables_get(mySprite)"
    export function flashlightSourceAttachedTo(sprite: Sprite): lightsource.FlashlightLightSource {
        return _state().getFlashlight(sprite)
    }

    //%block
    //%group="Circlelight"
    //%blockid=multilightGetCircleLightSourceAttachedTo block="circlelight attached to %sprite=variables_get(mySprite)"
    export function circleLightSourceAttachedTo(sprite: Sprite): lightsource.CircleLightSource {
        return _state().getCircleLight(sprite)
    }
}

namespace lightsource {

    export interface LightSource {
        apply(lightMap: Image): void
        setBandWidth(bandWidth: number): void
    }

    function changeRowLightLevel(lightMap: Image, x: number, y: number, width: number, lightLevel: number) {
        for (let x0 = x | 0; x0 < (width + x | 0); x0++) { // the " | 0 " fixes an issue with floating point imprecision causing the For loop to skip some X values, an issue still present in the original Multilights extension in the form of weird missing lines that are hard to find.
            let currentLightLevel = lightMap.getPixel(x0, y)
            lightMap.setPixel(x0, y, Math.min(lightLevel, currentLightLevel))
        }
    }

    function degreeToRadius(degree: number): number {
        return degree / 180 * Math.PI
    }

    function isValid(x: number, y: number, angle: number): boolean {
        angle = (angle + 360) % 360
        if (x > 0) {
            if (y < 0) {
                return 270 <= angle && angle < 360
            } else {
                return 0 < angle && angle <= 90
            }
        } else if (x < 0) {
            if (y < 0) {
                return 180 <= angle && angle < 270
            } else {
                return 90 < angle && angle <= 180
            }
        } else {
            if (y > 0) {
                return angle == 90
            } else {
                return angle == 270
            }
        }
    }


    //% blockNamespace="multilights"
    //% blockGap=16
    export class FlashlightLightSource implements LightSource {
        private sprite: Sprite;
        private _bandWidth: number;
        private _direction: number;
        private offsetTable: Buffer;
        private _angleRange: number;
        private _lightRange: number;
        private _darkness: number;
        private _shiver: number;

        private width: number;
        private height: number;

        setBandWidth(bandWidth: number): void {
            this._bandWidth = bandWidth
        }

        //% group="Flashlight" blockSetVariable="flashlight"
        //% blockCombine block="shiver" callInDebugger
        set shiver(shiver: number) {
            this._shiver = shiver
        }
        get shiver() {
            return this._shiver
        }

        //% group="Flashlight" blockSetVariable="flashlight"
        //% blockCombine block="lightRange" callInDebugger
        get lightRange() {
            return this._lightRange
        }
        set lightRange(lightRange: number) {
            this._lightRange = lightRange % 360
            this.prepareOffset()
        }

        //% group="Flashlight" blockSetVariable="flashlight"
        //% blockCombine block="direction" callInDebugger
        set direction(direction: number) {
            this._direction = direction % 360
        }
        get direction() {
            return this._direction
        }

        //% group="Flashlight" blockSetVariable="flashlight"
        //% blockCombine block="angleRange" callInDebugger
        get angleRange() {
            return this._angleRange
        }
        set angleRange(angleRange: number) {
            this._angleRange = angleRange / 2
        }

        //% group="Flashlight" blockSetVariable="flashlight"
        //% blockCombine block="darkness" callInDebugger
        get darkness() {
            return this._darkness
        }
        set darkness(darkness: number) {
            this._darkness = darkness
        }


        prepareOffset() {
            const halfh = this.lightRange;
            this.offsetTable = Buffer.create(halfh);

            // Approach is roughly based on https://hackernoon.com/pico-8-lighting-part-1-thin-dark-line-8ea15d21fed7
            let x: number;
            let y2: number;
            for (let y = 0; y <= halfh; y++) {
                // Store the offsets where the bands switch light levels for each row. We only need to
                // do one quadrant which we can mirror in x/

                // defering angle consideration to actual applying light map
                // may introduce wall-blocking in the future, caculation may require sprite position and tilemap
                x = Math.sqrt(Math.pow(this.lightRange, 2) - Math.pow(y, 2)) | 0;
                this.offsetTable[y] = x;
            }

            this.width = halfh;
            this.height = halfh;
        }

        constructor(sprite: Sprite, bandWidth: number, direction: number, lightRange: number, angleRange: number, darkness: number, shiver: number) {
            this.sprite = sprite
            this._bandWidth = bandWidth
            this._direction = direction % 360
            this._angleRange = angleRange / 2
            this._lightRange = lightRange
            this._darkness = darkness
            this._shiver = shiver

            this.prepareOffset()
        }



        apply(lightMap: Image) { // flashlight apply
            const camera = game.currentScene().camera;
            const halfh = this.width;
            const cx = this.sprite.x - camera.drawOffsetX;
            const cy = this.sprite.y - camera.drawOffsetY;

            let prev: number;
            let x0: number;
            let x1: number;
            let x2: number;
            let x3: number;
            let offset: number;
            let angleRangeLower = (360 + ((this._direction - this.angleRange) % 360)) % 360
            let angleRangeUpper = (360 + ((this._direction + this.angleRange) % 360)) % 360

            // Go over each row and light the colors
            for (let y = -halfh; y < halfh; y++) {
                offset = this.offsetTable[Math.abs(y)]
                x0 = -offset

                if (y == 0) {
                    if (angleRangeLower > angleRangeUpper) {
                        x0 = 0
                    } else if (180 > angleRangeLower && 180 < angleRangeUpper) {
                        offset = 0
                    } else {
                        x0 = 0
                        offset = 0
                    }
                } else {
                    x1 = y / Math.tan(degreeToRadius(angleRangeLower))
                    x2 = y / Math.tan(degreeToRadius(angleRangeUpper))


                    if (angleRangeLower == 90 || angleRangeLower == 270) {
                        x1 = 0
                    }
                    if (angleRangeUpper == 90 || angleRangeUpper == 270) {
                        x2 = 0
                    }


                    if (isValid(x1, y, angleRangeLower)) {
                        if (isValid(x2, y, angleRangeUpper)) {
                            if (x1 > x2) {
                                [x1, x2] = [x2, x1]
                            }
                            x0 = Math.max(x0, x1)
                            offset = Math.min(offset, x2)
                        } else {
                            if (y < 0) {
                                x0 = x1
                            } else {
                                offset = x1
                            }
                        }
                    } else {
                        if (isValid(x2, y, angleRangeUpper)) {
                            if (y < 0) {
                                offset = x2
                            } else {
                                x0 = x2
                            }
                        } else {
                            x0 = 0
                            offset = 0
                        }
                    }
                }

                if (offset - x0 > 0) {
                    offset += Math.idiv(Math.randomRange(0, this._shiver * 5), 5)
                    x0 -= Math.idiv(Math.randomRange(0, this._shiver * 5), 5)
                    changeRowLightLevel(lightMap, cx + x0, cy + y, Math.abs(x0 - offset), this._darkness)
                }
            }
        }
    }


    //% blockNamespace="multilights"
    //% blockGap=16
    export class CircleLightSource implements LightSource {
        private sprite: Sprite
        offsetTable: Buffer;
        baseImage: Image // image of the circle light without shiver

        private _bandWidth: number
        private width: number
        private height: number
        private _centerRadius: number
        private _shiver: number

        setBandWidth(bandWidth: number) {
            this._bandWidth = bandWidth
            this.prepareOffset()
        }

        getBandWidth(): number {
            return this._bandWidth
        }

        //% group="Circlelight" blockSetVariable="circleLight"
        //% blockCombine block="bandWidth" callInDebugger
        set bandWidth(bandWidth: number) {
            this._bandWidth = bandWidth
            this.prepareOffset()
        }

        get bandWidth() {
            return this._bandWidth
        }

        //% group="Circlelight" blockSetVariable="circleLight"
        //% blockCombine block="shiver" callInDebugger
        set shiver(shiver: number) {
            this._shiver = Math.max(0, (shiver | 0))
            this.prepareOffset()
        }

        get shiver() {
            return this._shiver
        }


        //% group="Circlelight" blockSetVariable="circleLight"
        //% blockCombine block="centerRadius" callInDebugger
        get centerRadius() {
            return this._centerRadius
        }

        set centerRadius(centerRadius: number) {
            this._centerRadius = centerRadius
            this.prepareOffset()
        }

        prepareOffset() {
            const halfh = this._centerRadius + this.rings * this._bandWidth;
            this.offsetTable = Buffer.create((this.rings + 1) * halfh);

            // Approach is roughly based on https://hackernoon.com/pico-8-lighting-part-1-thin-dark-line-8ea15d21fed7
            let x: number;
            let band: number;
            let y2: number;
            for (let y = 0; y < halfh; y++) {
                y2 = Math.pow(y, 2);
                // Store the offsets where the bands switch light levels for each row. We only need to
                // do one quadrant which we can mirror in x/y
                for (band = 0; band < this.rings; band++) {
                    x = Math.sqrt(Math.pow(this._centerRadius + this._bandWidth * (band + 1), 2) - y2) | 0;
                    this.offsetTable[y * this.rings + band] = x;
                }
            }

            this.width = halfh;
            this.height = halfh;

            this.baseImage = image.create(halfh * 2 + this._shiver * 2, halfh * 2 + 2)
            this.baseImage.fill(14)
            this.setup(this.baseImage)
            //game.splash(halfh)
        }

        constructor(sprite: Sprite, bandWidth: number, public rings: number, centerRadius: number, shiver: number) {
            this.sprite = sprite
            this._bandWidth = bandWidth
            this.rings = rings
            this._centerRadius = centerRadius
            this._shiver = shiver
            this.prepareOffset()
        }

        setup(lightMap: Image) {
            const halfh = this.width;
            const cx = halfh + this._shiver
            const cy = halfh
            
            let prev: number;
            let offset: number;
            let band: number;

            // Go over each row and light the colors
            for (let y = 0; y < halfh; y++) {
                band = this.rings;
                prev = 0;
                offset = this.offsetTable[y * this.rings + band - 1]

                // Darken each concentric circle by remapping the colors
                while (band >= 0) {
                    offset = this.offsetTable[y * this.rings + band - 1]
                    //if (offset) {
                    //    offset += Math.idiv(Math.randomRange(-this._shiver * 5, this._shiver * 5), 10)
                    //}

                    // We reflect the circle-quadrant horizontally and vertically
                    changeRowLightLevel(lightMap, cx + offset, cy + y + 1, prev - offset, band)
                    changeRowLightLevel(lightMap, cx - prev, cy + y + 1, prev - offset, band)
                    changeRowLightLevel(lightMap, cx + offset, cy - y, prev - offset, band)
                    changeRowLightLevel(lightMap, cx - prev, cy - y, prev - offset, band)

                    if (band == 0) {
                        changeRowLightLevel(lightMap, cx, cy + y + 1, prev, 0)
                        changeRowLightLevel(lightMap, cx - prev, cy + y + 1, prev, 0)
                        changeRowLightLevel(lightMap, cx, cy - y, prev, 0)
                        changeRowLightLevel(lightMap, cx - prev, cy - y, prev, 0)
                    }

                    prev = offset;
                    band--;
                }
            }
        }
        
        apply(lightMap: Image) { // circle apply
            if (!this._shiver) {
                const camera = game.currentScene().camera;
                helpers.mergeImage(lightMap, this.baseImage, (this.sprite.left | 0) + (this.sprite.width >> 1) - camera.drawOffsetX - (this.width | 0), (this.sprite.bottom | 0) - (this.sprite.height >> 1) - camera.drawOffsetY - (this.height | 0) - 1)
            } else {
                const temp = this.baseImage.clone()
                //const temp = image.create(this.baseImage.width, this.baseImage.height)
                //temp.fill(14)
                const halfh = this.width;
                const cx = halfh + this._shiver
                const cy = halfh

                let prev: number;
                let offset: number;
                let band: number;
                for (let y = 0; y < halfh; y++) {
                    band = this.rings;
                    prev = 0;
                    offset = this.offsetTable[y * this.rings + band - 1]

                    // Darken each concentric circle by remapping the colors
                    while (band >= 0) {
                        offset = this.offsetTable[y * this.rings + band - 1]
                        if (prev) {
                            let rand = Math.randomRange(0, this._shiver)
                
                            // We reflect the circle-quadrant horizontally and vertically
                            changeRowLightLevel(temp, cx + prev, cy + y + 1, rand, band) // bottom right
                            changeRowLightLevel(temp, cx - prev - rand, cy + y + 1, rand, band) // bottom left
                            changeRowLightLevel(temp, cx + prev, cy - y, rand, band) // top right
                            changeRowLightLevel(temp, cx - prev - rand, cy - y, rand, band) // top left

                        }

                        prev = offset;
                        band--;
                    }
                }
            
                const camera = game.currentScene().camera;
                helpers.mergeImage(lightMap, temp, (this.sprite.left | 0) + (this.sprite.width >> 1) - camera.drawOffsetX - (this.width | 0) - (this._shiver | 0), (this.sprite.bottom | 0) - (this.sprite.height >> 1) - camera.drawOffsetY - (this.height | 0) - 1)
            }
        }
    }
}

