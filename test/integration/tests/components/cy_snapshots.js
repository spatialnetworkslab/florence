module.exports = {
  "Assertions": {
    "Geo Tests": {
      "[render] geo polygons correctly": {
        "svg with 3 geo polygons": "<svg width=\"500\"\n  height=\"500\">\n  <defs>\n    <clipPath id=\"clip-sc0\">\n      <rect x=\"0\"\n        y=\"0\"\n        width=\"500\"\n        height=\"500\"></rect>\n    </clipPath>\n  </defs>\n  <g class=\"section\"\n    clip-path=\"url(#clip-sc0)\">\n    <path class=\"polygon\"\n      d=\"M3,167.66666666666669L497,167.66666666666669L497,332.3333333333333L3,332.3333333333333Z\"\n      fill=\"black\"\n      style=\"opacity: 0.5\"></path>\n    <path class=\"polygon\"\n      d=\"M167.66666666666666,167.66666666666669L250,208.83333333333334L85.33333333333333,208.83333333333334Z\"\n      fill=\"black\"\n      style=\"opacity: 0.5\"></path>\n    <path class=\"polygon\"\n      d=\"M332.3333333333333,332.3333333333333L250,291.16666666666663L414.6666666666667,291.16666666666663Z\"\n      fill=\"black\"\n      style=\"opacity: 0.5\"></path>\n  </g>\n</svg>"
      }
    },
    "Rectangle Tests": {
      "[render] rectangles snapshop correctly": {
        "svg with 3 rectangles": "<svg width=\"500\"\n  height=\"500\">\n  <defs>\n    <clipPath id=\"clip-sc0\">\n      <rect x=\"50\"\n        y=\"50\"\n        width=\"400\"\n        height=\"400\"></rect>\n    </clipPath>\n  </defs>\n  <g class=\"section\"\n    clip-path=\"url(#clip-sc0)\">\n    <path class=\"rectangle\"\n      d=\"M77.625,53L176.125,53L176.125,447L77.625,447Z\"\n      fill=\"yellow\"\n      style=\"opacity: 1\"></path>\n    <path class=\"rectangle\"\n      d=\"M200.75,53L299.25,53L299.25,263.1333333333333L200.75,263.1333333333333Z\"\n      fill=\"yellow\"\n      style=\"opacity: 1\"></path>\n    <path class=\"rectangle\"\n      d=\"M323.875,53L422.375,53L422.375,184.33333333333331L323.875,184.33333333333331Z\"\n      fill=\"yellow\"\n      style=\"opacity: 1\"></path>\n  </g>\n</svg>"
      }
    }
  },
  "__version": "3.4.0"
}
