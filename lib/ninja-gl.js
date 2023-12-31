class A {
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
    const r = E(this.gl, this.gl.VERTEX_SHADER, e), a = E(this.gl, this.gl.FRAGMENT_SHADER, i);
    return h(this.gl, r, a);
  }
  draw(e, i, r) {
    this.gl.useProgram(e), this.gl.bindVertexArray(i), this.gl.drawElements(this.gl.TRIANGLES, r, this.gl.UNSIGNED_SHORT, 0);
  }
  setUniform(e, i, r, a) {
    const s = this.gl.getUniformLocation(e, i);
    switch (a) {
      case this.gl.FLOAT:
        this.gl.uniform1f(s, r);
        break;
      case this.gl.FLOAT_VEC2:
        this.gl.uniform2fv(s, r);
        break;
      case this.gl.FLOAT_VEC3:
        this.gl.uniform3fv(s, r);
        break;
      case this.gl.FLOAT_VEC4:
        this.gl.uniform4fv(s, r);
        break;
      case this.gl.FLOAT_MAT4:
        this.gl.uniformMatrix4fv(s, !1, r);
        break;
      default:
        throw new Error("Invalid uniform type");
    }
  }
  setAttribute(e, i, r, a, s) {
    const n = this.gl.getAttribLocation(e, i);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, r), this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, a, this.gl.FLOAT, !1, s, 0);
  }
  setTexture(e, i, r, a, s) {
    const n = this.gl.getUniformLocation(e, i);
    this.gl.activeTexture(this.gl.TEXTURE0 + a), this.gl.bindTexture(this.gl.TEXTURE_2D, r), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT), s == null || s.forEach((o) => {
      this.gl.texParameterf(this.gl.TEXTURE_2D, o.key, o.value);
    }), this.gl.uniform1i(n, a);
  }
  createTexture(e) {
    return c(this.gl, e);
  }
  createVbo(e) {
    return T(this.gl, e);
  }
  createIbo(e) {
    return R(this.gl, e);
  }
  createVao(e, i) {
    return f(this.gl, e, i);
  }
}
function E(t, e, i) {
  const r = t.createShader(e);
  return r ? (t.shaderSource(r, i), t.compileShader(r), t.getShaderParameter(r, t.COMPILE_STATUS) === !1 && console.error("Shader Error: ", t.getShaderInfoLog(r)), r) : null;
}
function h(t, e, i) {
  const r = t.createProgram();
  return r ? (t.attachShader(r, e), t.attachShader(r, i), t.linkProgram(r), t.getProgramParameter(r, t.LINK_STATUS) === !1 && console.error("Program Error: ", t.getProgramInfoLog(r)), t.useProgram(r), r) : null;
}
function T(t, e) {
  const i = t.createBuffer();
  return t.bindBuffer(t.ARRAY_BUFFER, i), t.bufferData(t.ARRAY_BUFFER, new Float32Array(e), t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, null), i;
}
function R(t, e) {
  const i = t.createBuffer();
  return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i), t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Int16Array(e), t.STATIC_DRAW), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null), i;
}
function f(t, e, i) {
  const r = t.createVertexArray();
  return t.bindVertexArray(r), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i), t.bindBuffer(t.ARRAY_BUFFER, e), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 3, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), r;
}
function c(t, e) {
  const i = t.createTexture();
  return t.bindTexture(t.TEXTURE_2D, i), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e), t.generateMipmap(t.TEXTURE_2D), t.bindTexture(t.TEXTURE_2D, null), i;
}
export {
  A as default
};
