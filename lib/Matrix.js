class Matrix {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.data = [];
    for (let i = 0; i < columns * rows; i++) {
      this.data.push(0);
    }
  }
  copy() {
    let m = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        m.setValue(this.getValue(i,j), i, j);
      }
    }
    return m;
  }
  transpose() {
    let tmp = this.rows;
    this.rows = this.columns;
    this.columns = tmp;
  }
  setValue(val, row, column) {
    if(row >= this.rows || column >= this.columns) {
      throw "Matrix.js: Attempt to set value at non-existent location";
    }
    this.data[column + row * this.columns] = val;
  }
  getValue(row, column) {
    if(row >= this.rows || column >= this.columns) {
      throw "Matrix.js: Attempt to get value at non-existent location";
    }
    return this.data[column + row * this.columns];
  }
  scalar(r) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.setValue( r * this.data[i][j], i, j);
      }
    }
  }
  add(m) {
    if (this.rows !== m.rows || this.columns !== m.columns) {
      throw "Matrix.js: Incompatible dimensions for matrix addition";
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.setValue((this.getValue(i,j) + m.getValue(i,j)),i,j);
      }
    }
  }
  static Add(m1, m2) {
    if (m1.rows !== m2.rows || m1.columns !== m2.columns) {
      throw "Matrix.js: Incompatible dimensions for matrix addition";
    }
    let m = new Matrix(m1.rows, m1.columns);
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.columns; j++) {
        m.setValue((m1.getValue(i,j) + m2.getValue(i,j)),i,j);
      }
    }
    return m;
  }
  static Multiply(m1, m2) {
    if (m1.columns !== m2.rows) {
      throw "Matrix.js: Incompatible dimensions for matrix multiplication";
    }
    let m = new Matrix(m1.rows, m2.columns);
    for (let i = 0; i < m1.rows; i++) {
      for (let j = 0; j < m2.columns; j++) {
        let sum = 0;
        for (let k = 0; k < m1.columns; k++) {
          sum += m1.getValue(i, k) * m2.getValue(k,j);
        }
        m.setValue(sum, i, j);
      }
    }
    return m;
  }
  static Identity(dim) {
    let m = new Matrix(dim, dim);
    for (let i = 0; i < dim; i++) {
      m.setValue(1, i, i);
    }
    return m;
  }
  static RandomMatrix(rows, columns) {
    let m = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        m.setValue(Math.floor(Math.random()*2 - 1), i, j);
      }
    }
    return m;
  }
  print() {
    console.log(this.rows + " " + this.columns);
    for (let i = 0; i < this.rows; i++) {
      let str = "";
      for (let j = 0; j < this.columns; j++) {
        str += (this.getValue(i,j).toFixed(2) + " ");
      }
      console.log(str);
    }
  }
  static fromArray(arr, rows, columns) {
    if (arr.length !== rows * columns) {
      throw "Matrix.js: Incompatible dimensions to create matrix from given array";
    }
    let m = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        m.setValue(arr[j + i * columns], i, j);
      }
    }
    return m;
  }
  toArray() {
    return this.data;
  }
}
