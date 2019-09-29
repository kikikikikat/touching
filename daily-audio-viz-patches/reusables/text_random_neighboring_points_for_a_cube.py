import random, time
coord = 1.0
# assume the box is always centered
coords = [-coord, coord]

def is_different(existing_points, new_point):
    result = True
    for old_point in existing_points:
        if old_point == new_point:
            result = False
    return result

def get_next_neighboring_point(prev_point=None):
    if prev_point is None:
        result = [0] * 3
        for i in range(3):
            result[i] = random.choice(coords)
    else:
        result = prev_point.copy()
        axis_i = random.choice(range(3))
        result[axis_i] = -result[axis_i]
    return result
    


def get_points(num_of_lines):
    results = []
    results.append(get_next_neighboring_point())
    for i in range(num_of_lines): # num of points = num of lines + 1 - first point
        new_point = get_next_neighboring_point(results[i])
        while(is_different(results, new_point) == False):
            new_point = get_next_neighboring_point(results[i])
        results.append(new_point)
    return results

def fill_table(table_name, points):
    table = op(table_name)
    for row in range(len(points)):
        for i in range(3):
            table[row, i] = points[row][i]
    




number_of_points = 4
number_of_lines = number_of_points - 1
tables = [
    'cube1/table1',
    'cube2/table2',
    'cube3/table3',
    'cube4/table4',
    'cube5/table5',
    'cube6/table6',
    'cube7/table7',
    'cube8/table8',
    'cube9/table9',
]

for t in tables:
    points = get_points(3)
    fill_table(t, points)




