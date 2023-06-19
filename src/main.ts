type Context = WebGL2RenderingContext
type Shader = WebGLShader
type Program = WebGLProgram

class Gl {
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
    setUniform(program: Program, name: string, value: number): void {
        const location = this.gl.getUniformLocation(program, name)
        this.gl.uniform1f(location, value)
    }
    setUniformMatrix(program: Program, name: string, value: number[]): void {
        const location = this.gl.getUniformLocation(program, name)
        this.gl.uniformMatrix4fv(location, false, value)
    }
    setAttribute(program: Program, name: string, vbo: WebGLBuffer, stride: number): void {
        const location = this.gl.getAttribLocation(program, name)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
        this.gl.enableVertexAttribArray(location)
        this.gl.vertexAttribPointer(location, 3, this.gl.FLOAT, false, stride, 0)
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
}

function createShader(gl: Context, type: number, source: string): Shader | null {
    const shader = gl.createShader(type)

    if (!shader) {
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
        console.error(gl.getShaderInfoLog(shader))
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

    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
        console.error(gl.getProgramInfoLog(program))
    }

    gl.linkProgram(program)
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

function createFramebuffer(gl: Context, width: number, height: number): WebGLFramebuffer | null {
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)

    const depthRenderbuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return framebuffer
}