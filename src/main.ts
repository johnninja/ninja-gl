type Context = WebGL2RenderingContext
type Shader = WebGLShader
type Program = WebGLProgram

class NinjaGl {
    constructor(private readonly gl: Context) {
        this.gl = gl
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
    create(vs: string, fs: string): Program | null{
        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vs)!
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fs)!
        return createProgram(this.gl, vertexShader, fragmentShader)
    }
    draw(program: Program, vao: WebGLVertexArrayObject, count: number): void {
        this.gl.useProgram(program)
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
    setUniformMatrix(program: Program, name: string, value: number[]): void {
        const location = this.gl.getUniformLocation(program, name)
        this.gl.uniformMatrix4fv(location, false, value)
    }
    setAttribute(program: Program, name: string, vbo: WebGLBuffer, size: number, stride: number): void {
        const location = this.gl.getAttribLocation(program, name)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
        this.gl.enableVertexAttribArray(location)
        this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, stride, 0)
    }
    setTexture(program: Program, name: string, texture: WebGLTexture, index: number, params: { key: number, value: number}[]): void {
        const location = this.gl.getUniformLocation(program, name)
       
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)

        params.forEach((param) => {
            this.gl.texParameterf(this.gl.TEXTURE_2D, param.key, param.value)
        })
        this.gl.activeTexture(this.gl.TEXTURE0 + index)
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.gl.uniform1i(location, index)
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
    createVao(vbo: WebGLBuffer, ibo: WebGLBuffer): WebGLVertexArrayObject {
        return createVao(this.gl, vbo, ibo)
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

function createVao(gl: Context, vbo: WebGLBuffer, ibo: WebGLBuffer): WebGLVertexArrayObject {
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
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

export default NinjaGl