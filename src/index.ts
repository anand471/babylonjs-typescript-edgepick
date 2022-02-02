import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

import { LinesMesh, PointerEventTypes, VertexData } from "@babylonjs/core"

const canvasElement = document.getElementById("canvasElement") as HTMLCanvasElement
const engine = new Engine(canvasElement, true)

var createScene = function (canvas: HTMLCanvasElement) {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 100, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(5, 5, 5));

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light1', new Vector3(100, 100, 100), scene);
    light.intensity = 0.5;

    scene.pointerMovePredicate = () => { return true; }

    scene.onPointerObservable.add((e) => {

        //console.log('PickInfo', e.pickInfo);
        switch (e.type) {
            case PointerEventTypes.POINTERMOVE: {
                if (e.pickInfo.hit === true) {
                    
                    console.log('Pick:', e.pickInfo.pickedMesh.id, e.pickInfo.pickedPoint);

                    if (!!e.pickInfo.pickedMesh) {
                        var pick = scene.multiPick(e.event.offsetX, e.event.offsetY);
                        if (pick.length > 0) {
                            console.log('MultiPick:', pick[0].pickedMesh.id, pick[0].pickedPoint);
                            console.log(pick[0]);
                        }
                    }
                }
                break;
            }
            case PointerEventTypes.POINTERDOWN: {
                break;
            }
        }
    });

    var vertexData = new VertexData();
    vertexData.positions = [0, 1, 0, 0, 2, 0];
    vertexData.normals = [1, 0, 0, 1, 0, 0];
    vertexData.colors = null;
    vertexData.indices = [0, 1];

    var linesMesh = new LinesMesh('LinesMesh', scene);
    vertexData.applyToMesh(linesMesh);
    linesMesh.isPickable = false;
    linesMesh.isVisible = false;

    var lineMeshInstance = linesMesh.createInstance('Instance_' + linesMesh.id);
    lineMeshInstance.isVisible = true;
    lineMeshInstance.isPickable = true;

    return scene;

};

let scene = createScene(canvasElement);

engine.runRenderLoop(() => {
    scene.render();
})
