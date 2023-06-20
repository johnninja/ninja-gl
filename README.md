# ninja-gl
self use webgl tools

# usage
```ts
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!
const ninjaGl = new NinjaGl(gl)
const program = ninjaGl.create(
    `
    attribute vec3 position;
    void main(void) {
        gl_Position = vec4(position, 1.0);
    }
    `,
    `
    precision mediump float;
    uniform vec4 color;
    void main(void) {
        gl_FragColor = color;
    }
    `
)!

// draw rectangle
const vbo = ninjaGl.createVbo([
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
])
const ibo = ninjaGl.createIbo([
    0, 1, 2, 
    0, 2, 3
])
const vao = ninjaGl.createVao(vbo, ibo)

ninjaGl.setAttribute(program, 'position', vbo, 3, 0)
ninjaGl.setUniform(program, 'color', [1.0, 0.0, 0.0, 1.0], gl.FLOAT_VEC4)

ninjaGl.clear()
ninjaGl.clearColor(0.0, 0.0, 0.0, 1.0)
ninjaGl.draw(program, vao, 6)

```

