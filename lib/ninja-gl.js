class A {
  constructor(r) {
    this.gl = r, this.gl = r;
  }
  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  clearColor(r, i, e, a) {
    this.gl.clearColor(r, i, e, a);
  }
  viewport(r, i, e, a) {
    this.gl.viewport(r, i, e, a);
  }
  drawElements(r, i, e, a) {
    this.gl.drawElements(r, i, e, a);
  }
  create(r, i) {
    const e = E(this.gl, this.gl.VERTEX_SHADER, r), a = E(this.gl, this.gl.FRAGMENT_SHADER, i);
    return h(this.gl, e, a);
  }
  draw(r, i, e) {
    this.gl.useProgram(r), this.gl.bindVertexArray(i), this.gl.drawElements(this.gl.TRIANGLES, e, this.gl.UNSIGNED_SHORT, 0);
  }
  setUniform(r, i, e, a) {
    const s = this.gl.getUniformLocation(r, i);
    switch (a) {
      case this.gl.FLOAT:
        this.gl.uniform1f(s, e);
        break;
      case this.gl.FLOAT_VEC2:
        this.gl.uniform2fv(s, e);
        break;
      case this.gl.FLOAT_VEC3:
        this.gl.uniform3fv(s, e);
        break;
      case this.gl.FLOAT_VEC4:
        this.gl.uniform4fv(s, e);
        break;
      case this.gl.FLOAT_MAT4:
        this.gl.uniformMatrix4fv(s, !1, e);
        break;
      default:
        throw new Error("Invalid uniform type");
    }
  }
  setUniformMatrix(r, i, e) {
    const a = this.gl.getUniformLocation(r, i);
    this.gl.uniformMatrix4fv(a, !1, e);
  }
  setAttribute(r, i, e, a, s) {
    const n = this.gl.getAttribLocation(r, i);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e), this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, a, this.gl.FLOAT, !1, s, 0);
  }
  setTexture(r, i, e, a, s) {
    const n = this.gl.getUniformLocation(r, i);
    this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT), s.forEach((o) => {
      this.gl.texParameterf(this.gl.TEXTURE_2D, o.key, o.value);
    }), this.gl.activeTexture(this.gl.TEXTURE0 + a), this.gl.bindTexture(this.gl.TEXTURE_2D, e), this.gl.uniform1i(n, a);
  }
  createTexture(r) {
    return R(this.gl, r);
  }
  createVbo(r) {
    return T(this.gl, r);
  }
  createIbo(r) {
    return f(this.gl, r);
  }
  createVao(r, i) {
    return c(this.gl, r, i);
  }
}
function E(t, r, i) {
  const e = t.createShader(r);
  return e ? (t.shaderSource(e, i), t.compileShader(e), t.getShaderParameter(e, t.COMPILE_STATUS) === !1 && console.error("Shader Error: ", t.getShaderInfoLog(e)), e) : null;
}
function h(t, r, i) {
  const e = t.createProgram();
  return e ? (t.attachShader(e, r), t.attachShader(e, i), t.linkProgram(e), t.getProgramParameter(e, t.LINK_STATUS) === !1 && console.error("Program Error: ", t.getProgramInfoLog(e)), t.useProgram(e), e) : null;
}
function T(t, r) {
  const i = t.createBuffer();
  return t.bindBuffer(t.ARRAY_BUFFER, i), t.bufferData(t.ARRAY_BUFFER, new Float32Array(r), t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, null), i;
}
function f(t, r) {
  const i = t.createBuffer();
  return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i), t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Int16Array(r), t.STATIC_DRAW), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null), i;
}
function c(t, r, i) {
  const e = t.createVertexArray();
  return t.bindVertexArray(e), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i), t.bindBuffer(t.ARRAY_BUFFER, r), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 3, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), e;
}
function R(t, r) {
  const i = t.createTexture();
  return t.bindTexture(t.TEXTURE_2D, i), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r), t.generateMipmap(t.TEXTURE_2D), t.bindTexture(t.TEXTURE_2D, null), i;
}
export {
  A as default
};
