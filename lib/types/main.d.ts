type Context = WebGL2RenderingContext;
type Program = WebGLProgram;
declare class NinjaGl {
    private readonly gl;
    constructor(gl: Context);
    clear(): void;
    clearColor(r: number, g: number, b: number, a: number): void;
    viewport(x: number, y: number, width: number, height: number): void;
    drawElements(mode: number, count: number, type: number, offset: number): void;
    create(vs: string, fs: string): Program | null;
    draw(program: Program, vao: WebGLVertexArrayObject, count: number): void;
    setUniform(program: Program, name: string, value: number): void;
    setUniformMatrix(program: Program, name: string, value: number[]): void;
    setAttribute(program: Program, name: string, vbo: WebGLBuffer, stride: number): void;
    setTexture(program: Program, name: string, texture: WebGLTexture, index: number, params: {
        key: number;
        value: number;
    }[]): void;
    createTexture(source: HTMLImageElement): WebGLTexture;
    createVbo(data: number[]): WebGLBuffer;
    createIbo(data: number[]): WebGLBuffer;
    createVao(vbo: WebGLBuffer, ibo: WebGLBuffer): WebGLVertexArrayObject;
}
export default NinjaGl;
