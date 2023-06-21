type Context = WebGL2RenderingContext
type Shader = WebGLShader
type Program = WebGLProgram

interface IAttribute {
    size: number
    stride: number
    data: number[]
    indices?: number[]
    vbo?: WebGLBuffer
}

interface IUniform {
    type: number
    value: number | number[]
}

interface ITexture {
    source: HTMLImageElement
    index: number
    params?: { key: number, value: number }[]
}

class NinjaGl {
    attribues: { [key: string]: IAttribute } = {}
    uniforms: { [key: string]: IUniform } = {}
    textures: { [key: string]: ITexture } = {}
    program: WebGLProgram | null = null
    constructor(private readonly gl: Context) {
        this.gl = gl
        this.uniforms = new Proxy(this.uniforms, {
            set: (target, key, value) => {
                if (!this.program) {
                    return false
                }
                if (Array.isArray(value) || typeof value === 'number') {
                    const cfg = this.uniforms[key as string]
                    if (cfg) {
                        cfg.value = value as number | number[]
                        this.setUniform(this.program, key as string, value, cfg.type)
                    } else {
                        throw new Error('Please set uniform type first')
                    }
                } else if (typeof value === 'object') {
                    target[key as string] = value
                    this.setUniform(this.program, key as string, value.value, value.type)
                } else {
                    throw new Error('Invalid uniform value')
                }
                return true
            }
        })
        this.textures = new Proxy(this.textures, {
            set: (target, key, value) => {
                if (!this.program) {
                    return false
                }
                if (typeof value === 'object') {
                    target[key as string] = value
                    this.setTexture(this.program, key as string, value.source, value.index, value.params)
                } else {
                    throw new Error('Invalid texture value')
                }
                return true
            }
        })
    }
    clear(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }
    clearColor(r: number, g: number, b: number, a: number): void {
        this.gl.clearColor(r, g, b, a)
    }
    viewport(x: number, y: number, width: number, height: number): void {
        this.gl.viewport(x, y, width, height)
    }
    drawElements(mode: number, count: number, type: number, offset: number): void {
        this.gl.drawElements(mode, count, type, offset)
    }
    create(vs: string, fs: string): Program | null {
        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vs)!
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fs)!
        this.program = createProgram(this.gl, vertexShader, fragmentShader)

        return this.program
    }
    draw(vao: WebGLVertexArrayObject, count: number): void {
        this.gl.useProgram(this.program)
        this.gl.bindVertexArray(vao)
        this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0)
    }
    setUniform(program: Program, name: string, value: number | number[], type: number): void {
        const location = this.gl.getUniformLocation(program, name)
        switch (type) {
            case this.gl.FLOAT:
                this.gl.uniform1f(location, value as number)
                break
            case this.gl.FLOAT_VEC2:
                this.gl.uniform2fv(location, value as number[])
                break
            case this.gl.FLOAT_VEC3:
                this.gl.uniform3fv(location, value as number[])
                break
            case this.gl.FLOAT_VEC4:
                this.gl.uniform4fv(location, value as number[])
                break
            case this.gl.FLOAT_MAT4:
                this.gl.uniformMatrix4fv(location, false, value as number[])
                break
            default:
                throw new Error('Invalid uniform type')
        }
    }
    setAttribute(program: Program, name: string, vbo: WebGLBuffer, size: number, stride: number): void {
        const location = this.gl.getAttribLocation(program, name)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
        this.gl.enableVertexAttribArray(location)
        this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, stride, 0)
    }
    setTexture(program: Program, name: string, source: HTMLImageElement, index: number, params?: { key: number, value: number }[]): void {
        const uSampler = this.gl.getUniformLocation(program, name)
        const texture = this.gl.createTexture()

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1)
        this.gl.activeTexture(this.gl.TEXTURE0 + index)
        this.gl.bindTexture(gl.TEXTURE_2D, texture)
        this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
        this.gl.generateMipmap(gl.TEXTURE_2D)

        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)

        params?.forEach((param) => {
            this.gl.texParameterf(this.gl.TEXTURE_2D, param.key, param.value)
        })
        this.gl.uniform1i(uSampler, index)
    }
    createTexture(source: HTMLImageElement): WebGLTexture {
        return createTexture(this.gl, source)!
    }
    createVbo(data: number[]): WebGLBuffer {
        return createVbo(this.gl, data)
    }
    createIbo(data: number[]): WebGLBuffer {
        return createIbo(this.gl, data)
    }
    createVao(vbos: IVbo[], ibos?: WebGLBuffer[]): WebGLVertexArrayObject {
        return createVao(this.gl, vbos, ibos)
    }
    loadTexture(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                resolve(image)
            }
            image.onerror = () => {
                reject()
            }
            image.src = src
        })
    }
    setup(): WebGLVertexArrayObject {
        const vbos = []
        const indices = []
        for (const key in this.attribues) {
            const vbo = this.createVbo(this.attribues[key].data)
            const ibo = this.createIbo(this.attribues[key].indices ?? [])
            this.attribues[key].vbo = this.createVbo(this.attribues[key].data)
            vbos.push({
                vbo,
                size: this.attribues[key].size,
                stride: this.attribues[key].stride,
            })

            if (ibo) {
                indices.push(ibo)
            }
        }

        const vao = this.createVao(vbos, indices.length > 0 ? indices : undefined)
        this.gl.bindVertexArray(vao)

        return vao
    }
}

function createShader(gl: Context, type: number, source: string): Shader | null {
    const shader = gl.createShader(type)

    if (!shader) {
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
        console.error('Shader Error: ', gl.getShaderInfoLog(shader))
    }

    return shader
}

function createProgram(gl: Context, vs: Shader, fs: Shader): Program | null {
    const program = gl.createProgram()

    if (!program) {
        return null
    }

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
        console.error('Program Error: ', gl.getProgramInfoLog(program))
    }

    gl.useProgram(program)

    return program
}

function createVbo(gl: Context, data: number[]): WebGLBuffer {
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return vbo!
}

function createIbo(gl: Context, data: number[]): WebGLBuffer {
    const ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return ibo!
}

interface IVbo {
    vbo: WebGLBuffer
    size: number
    stride: number
}

function createVao(gl: Context, vbos: IVbo[], ibos?: WebGLBuffer[]): WebGLVertexArrayObject {
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    ibos?.forEach((ibo) => {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    })
    vbos.forEach((vbo, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vbo)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, vbo.size, gl.FLOAT, false, vbo.stride, 0)
    })
    gl.bindVertexArray(null)

    return vao!
}

function createTexture(gl: Context, source: HTMLImageElement): WebGLTexture | null {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)

    return texture
}


const canvas = document.getElementById('canvas') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!
const ninjaGl = new NinjaGl(gl)
const program = ninjaGl.create(
    `
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 v_uv;
    void main(void) {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
    }
    `,
    `
    precision mediump float;
    uniform vec4 color;
    uniform float time;
    uniform sampler2D tex;
    varying vec2 v_uv;

    void main(void) {
        float t = (sin(time) + 1.0) / 2.0;
        vec4 bg = vec4(0.0, t, 0.0, 1.0);
        // gl_FragColor = color * bg * texture2D(tex, v_uv);
        gl_FragColor = texture2D(tex, v_uv);
    }
    `
)!

ninjaGl.attribues = {
    position: {
        data: [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ],
        size: 3,
        stride: 0,
        indices: [
            0, 1, 2,
            0, 2, 3
        ]
    },
    uv: {
        data: [
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0
        ],
        size: 2,
        stride: 0,
    },
}
ninjaGl.uniforms = {
    color: {
        type: gl.FLOAT_VEC4,
        value: [1.0, 0.0, 0.0, 1.0],
    },
    time: {
        type: gl.FLOAT,
        value: 0,
    }
}

ninjaGl.loadTexture('./cat.awebp')
    .then((texture) => {
        ninjaGl.textures = {
            tex: {
                source: texture,
                index: 0
            },
        }
        const vao = ninjaGl.setup()
        ninjaGl.draw(vao, 6)
    })


// // 顶点缓冲对象
// const vbo = ninjaGl.createVbo([
//                 1.0, 1.0, 0.0,
//                 -1.0, 1.0, 0.0,
//                 -1.0, -1.0, 0.0,
//                 1.0, -1.0, 0.0
//             ])

// // 索引缓冲对象
// const ibo = ninjaGl.createIbo([
//                 0, 1, 2,
//                 0, 2, 3
//             ])

// // uv
// const uv = ninjaGl.createVbo([
//                 1.0, 1.0,
//                 -1.0, 1.0,
//                 -1.0, -1.0,
//                 1.0, -1.0
//             ])

// // vao
// const vao = ninjaGl.createVao([
//                 {   // position
//                     vbo,
//                     size: 3,
//                     stride: 0
//                 },
//                 {   // uv
//                     vbo: uv,
//                     size: 2,
//                     stride: 0
//                 }
//             ], [ibo])


// ninjaGl.setUniform(program, 'color', [1.0, 0.0, 0.0, 1.0], gl.FLOAT_VEC4)

// new Promise((resolve, reject) => {
//                 const img = new Image()
//                 img.onload = () => resolve(img)
//                 img.onerror = reject
//                 img.src = './cat.awebp'
//             }).then((img) => {
//                 ninjaGl.setTexture(program, 'tex', img as HTMLImageElement, 0, [
//                     // { key: gl.TEXTURE_MIN_FILTER, value: gl.LINEAR },
//                     // { key: gl.TEXTURE_MAG_FILTER, value: gl.LINEAR },
//                     { key: gl.TEXTURE_WRAP_S, value: gl.CLAMP_TO_EDGE },
//                     { key: gl.TEXTURE_WRAP_T, value: gl.CLAMP_TO_EDGE },
//                 ])

//                 ninjaGl.viewport(0, 0, canvas.width, canvas.height)
//                 ninjaGl.clear()
//                 ninjaGl.clearColor(0.0, 0.0, 0.0, 1.0)

//                 render()
//             })

// function render() {
//     requestAnimationFrame(render)
//     ninjaGl.setUniform(program, 'time', performance.now() / 1000, gl.FLOAT)
//     ninjaGl.draw(program, vao, 6)
// }



export default NinjaGl