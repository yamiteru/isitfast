from bokeh.plotting import figure, show

x = [1, 2, 3, 4, 5]
y = [6, 7, 2, 4, 5]

p = figure(title="Simple example", x_axis_label="x", y_axis_label="y")

p.circle(x, y, size=10)

show(p)
