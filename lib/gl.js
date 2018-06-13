let gl;
let program;
function glInit() {
  gl = getWebgl();
  if(!gl) {
    throw new Error("Could not get webgl handle");
  }
  let vshader = document.getElementById("vertex").text;
  let fshader = document.getElementById("fragment").text;

  let vs = getShader(vshader, gl.VERTEX_SHADER);
  let fs = getShader(fshader, gl.FRAGMENT_SHADER);
  program = createShaderObject(vs, fs);
  gl.useProgram(program);
  show();
}

function getXData() {
  return {
    vertices: [
    1,1,1,
    1,1,-1,
    -1,1,1,
    -1,1,-1,

    0.8,1,0.8,
    0.8,1,-0.8,
    -0.8,1,0.8,
    -0.8,1,-0.8,

    1,1,0.8,
    1,1,-0.8,
    -1,1,0.8,
    -1,1,-0.8,

    0.8,1,1,
    0.8,1,-1,
    -0.8,1,1,
    -0.8,1,-1,

    1,-1,1,
    1,-1,-1,
    -1,-1,1,
    -1,-1,-1,

    0.8,-1,0.8,
    0.8,-1,-0.8,
    -0.8,-1,0.8,
    -0.8,-1,-0.8,

    1,-1,0.8,
    1,-1,-0.8,
    -1,-1,0.8,
    -1,-1,-0.8,

    0.8,-1,1,
    0.8,-1,-1,
    -0.8,-1,1,
    -0.8,-1,-1,

    0, 0.5, 1,
    0, 0.5, 0.8,

    0, 0.5, -1,
    0, 0.5, -0.8,

    1, 0.5, 0,
    0.8, 0.5, 0,

    -1, 0.5, 0,
    -0.8, 0.5, 0,

    0, -0.5, 1,
    0, -0.5, 0.8,

    0, -0.5, -1,
    0, -0.5, -0.8,

    1, -0.5, 0,
    0.8, -0.5, 0,

    -1, -0.5, 0,
    -0.8, -0.5, 0,


    0.5, 0, 1,
    -0.5, 0, 1,

    0.5, 0, -1,
    -0.5, 0, -1,

    0.5, 0, 0.8,
    -0.5, 0, 0.8,

    0.5, 0, -0.8,
    -0.5, 0, -0.8,

    1, 0, 0.5,
    1, 0, -0.5,

    -1, 0, 0.5,
    -1, 0, -0.5,

    0.8, 0, 0.5,
    0.8, 0, -0.5,

    -0.8, 0, 0.5,
    -0.8, 0, -0.5,

  ]};
}
let axis = Matrix.fromArray([0,1,0],3,1);
let position = Matrix.fromArray([0.0,0.0,-2.0],3,1);
let rotation = 0.0;

function show() {

  /* one time */
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);


  /* every frame */
  gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  setProjectionMatrix(program, 60, window.screen.width/window.screen.height, 1, 10);

  setModelView(program, position, rotation, axis);

  let xdata = getXData();
  let vbo = createFloatBuffer(xdata.vertices);

  let ibo = createIndexBuffer(xdata.faces);

  /* enable */
  let aVertex = gl.getAttribLocation(program, "aVertex");
  gl.enableVertexAttribArray(aVertex);

  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.POINTS, 0, Math.floor(xdata.vertices.length/3));

  rotation += 0.01;
  window.requestAnimationFrame(show);
}

function setProjectionMatrix(program, fov, aspect, near, far) {
  let projMatrix = createPerspectiveMat4(fov, aspect, near, far);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uProjection"),
    false,
    projMatrix.toArray(),
  );
  return projMatrix;
}

function createPerspectiveMat4(fov, aspect, near, far) {
  let f = 1.0 / Math.tan(fov * Math.PI / 360);
  let nf = 1.0 / (near - far);
  let m = Matrix.fromArray([
    f/aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far+near)*nf, (2*far*near)*nf,
    0, 0, -1, 0
  ], 4, 4);
  return m;
}

function setModelView(program, pos, rot, axis) {
  let mv = Matrix.Identity(4);
  translateMat4(mv, pos);
  rotateMat4(mv, rot, axis);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uModelView"),
    false,
    mv.toArray(),
  );
  return mv;
}

function translateMat4(M, V) {
  let x = V.getValue(0,0);
  let y = V.getValue(1,0);
  let z = V.getValue(2,0);
  M.setValue((M.getValue(0,0)*x + M.getValue(1,0) * y + M.getValue(2,0) * z + M.getValue(3,0)),3,0);
  M.setValue((M.getValue(0,1)*x + M.getValue(1,1) * y + M.getValue(2,1) * z + M.getValue(3,1)),3,1);
  M.setValue((M.getValue(0,2)*x + M.getValue(1,2) * y + M.getValue(2,2) * z + M.getValue(3,2)),3,2);
  M.setValue((M.getValue(0,3)*x + M.getValue(1,3) * y + M.getValue(2,3) * z + M.getValue(3,3)),3,3);
}

function rotateMat4(M, A, axis) {
  let x = axis.getValue(0,0);
  let y = axis.getValue(1,0);
  let z = axis.getValue(2,0);

  let axisLength = Math.sqrt(x*x + y*y + z*z);
  let sA = Math.sin(A);
  let cA = Math.cos(A);
  let t = 1 - cA;

  x = x / axisLength;
  y = y / axisLength;
  z = z / axisLength;

  let rm = new Matrix(4,4);
  rm.setValue(x*x*t+cA,0,0);
  rm.setValue(y*x*t+z*sA,0,1);
  rm.setValue(z*x*t-y*sA,0,2);
  rm.setValue(x*y*t-z*sA,1,0);
  rm.setValue(y*y*t+cA,1,1);
  rm.setValue(z*y*t+x*sA,1,2);
  rm.setValue(x*z*t+y*sA,2,0);
  rm.setValue(y*z*t-x*sA,2,1);
  rm.setValue(z*z*cA,2,2);

  let mm = Matrix.Multiply(rm, M);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      M.setValue(mm.getValue(i,j),i,j);
    }
  }

}

function createFloatBuffer(data) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}
function createIndexBuffer(data) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

function getWebgl() {
  let canvas = document.getElementById("c");
  let gl = canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
  return gl;
}

function createShaderObject(vs, fs) {
  let program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  return program;
}

function getShader(source, type) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
}
