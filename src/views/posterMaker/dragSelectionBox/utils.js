/**
 * polygon-polygon collision
 * based on http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
 * @param {number[]} points1 [x1, y1, x2, y2, ... xn, yn] of first polygon
 * @param {number[]} points2 [x1, y1, x2, y2, ... xn, yn] of second polygon
 * @return {boolean}
 */
export function polygonPolygonCollision(points1, points2) {
  var a = points1
  var b = points2
  var polygons = [a, b]
  var minA, maxA, projected, minB, maxB, j
  for (var i = 0; i < polygons.length; i++) {
    var polygon = polygons[i]
    for (var i1 = 0; i1 < polygon.length; i1 += 2) {
      var i2 = (i1 + 2) % polygon.length
      var normal = { x: polygon[i2 + 1] - polygon[i1 + 1], y: polygon[i1] - polygon[i2] }
      minA = maxA = null
      for (j = 0; j < a.length; j += 2) {
        projected = normal.x * a[j] + normal.y * a[j + 1]
        if (minA === null || projected < minA) {
          minA = projected
        }
        if (maxA === null || projected > maxA) {
          maxA = projected
        }
      }
      minB = maxB = null
      for (j = 0; j < b.length; j += 2) {
        projected = normal.x * b[j] + normal.y * b[j + 1]
        if (minB === null || projected < minB) {
          minB = projected
        }
        if (maxB === null || projected > maxB) {
          maxB = projected
        }
      }
      if (maxA < minB || maxB < minA) {
        return false
      }
    }
  }
  return true
}

/**
 * box-box collision
 * @param {number} x1 top-left corner of first box
 * @param {number} y1 top-left corner of first box
 * @param {number} w1 width of first box
 * @param {number} h1 height of first box
 * @param {number} x2 top-left corner of second box
 * @param {number} y2 top-left corner of second box
 * @param {number} w2 width of second box
 * @param {number} h2 height of second box
 */
export function boxBoxCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

/**
 * 坐标转换
 * @param {number} pointOrigin 旋转前的点
 * @param {number} pointCenter 旋转后的点
 * @param {number} deg 旋转后的角度
 */
export const computedRotatedCoordinate = (pointOrigin, pointCenter, deg) => {
  const angle = (Math.PI / 180) * deg
  const x = (pointOrigin.x - pointCenter.x) * Math.cos(angle) - (pointOrigin.y - pointCenter.y) * Math.sin(angle) + pointCenter.x
  const y = (pointOrigin.x - pointCenter.x) * Math.sin(angle) + (pointOrigin.y - pointCenter.y) * Math.cos(angle) + pointCenter.y
  return { x, y }
}
