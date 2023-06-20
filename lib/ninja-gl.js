class c {
  constructor(e) {
    this.gl = e, this.gl = e;
  }
  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  clearColor(e, i, r, a) {
    this.gl.clearColor(e, i, r, a);
  }
  viewport(e, i, r, a) {
    this.gl.viewport(e, i, r, a);
  }
  drawElements(e, i, r, a) {
    this.gl.drawElements(e, i, r, a);
  }
  create(e, i) {
    const r = o(this.gl, this.gl.VERTEX_SHADER, e), a = o(this.gl, this.gl.FRAGMENT_SHADER, i);
    return E(this.gl, r, a);
  }
  draw(e, i, r) {
    this.gl.useProgram(e), this.gl.bindVertexArray(i), this.gl.drawElements(this.gl.TRIANGLES, r, this.gl.UNSIGNED_SHORT, 0);
  }
  setUniform(e, i, r) {
    const a = this.gl.getUniformLocation(e, i);
    this.gl.uniform1f(a, r);
  }
  setUniformMatrix(e, i, r) {
    const a = this.gl.getUniformLocation(e, i);
    this.gl.uniformMatrix4fv(a, !1, r);
  }
  setAttribute(e, i, r, a) {
    const s = this.gl.getAttribLocation(e, i);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, r), this.gl.enableVertexAttribArray(s), this.gl.vertexAttribPointer(s, 3, this.gl.FLOAT, !1, a, 0);
  }
  setTexture(e, i, r, a, s) {
    const h = this.gl.getUniformLocation(e, i);
    this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT), s.forEach((n) => {
      this.gl.texParameterf(this.gl.TEXTURE_2D, n.key, n.value);
    }), this.gl.activeTexture(this.gl.TEXTURE0 + a), this.gl.bindTexture(this.gl.TEXTURE_2D, r), this.gl.uniform1i(h, a);
  }
  createTexture(e) {
    return R(this.gl, e);
  }
  createVbo(e) {
    return l(this.gl, e);
  }
  createIbo(e) {
    return T(this.gl, e);
  }
  createVao(e, i) {
    const r = this.gl.createVertexArray();
    return this.gl.bindVertexArray(r), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, i), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e), this.gl.enableVertexAttribArray(0), this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, !1, 0, 0), this.gl.bindVertexArray(null), r;
  }
}
function o(t, e, i) {
  const r = t.createShader(e);
  return r ? (t.shaderSource(r, i), t.compileShader(r), t.getShaderParameter(r, t.COMPILE_STATUS) === !1 && console.error(t.getShaderInfoLog(r)), r) : null;
}
function E(t, e, i) {
  const r = t.createProgram();
  return r ? (t.attachShader(r, e), t.attachShader(r, i), t.getProgramParameter(r, t.LINK_STATUS) === !1 && console.error(t.getProgramInfoLog(r)), t.linkProgram(r), t.useProgram(r), r) : null;
}
function l(t, e) {
  const i = t.createBuffer();
  return t.bindBuffer(t.ARRAY_BUFFER, i), t.bufferData(t.ARRAY_BUFFER, new Float32Array(e), t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, null), i;
}
function T(t, e) {
  const i = t.createBuffer();
  return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i), t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Int16Array(e), t.STATIC_DRAW), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null), i;
}
function R(t, e) {
  const i = t.createTexture();
  return t.bindTexture(t.TEXTURE_2D, i), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e), t.generateMipmap(t.TEXTURE_2D), t.bindTexture(t.TEXTURE_2D, null), i;
}
export {
  c as default
};
