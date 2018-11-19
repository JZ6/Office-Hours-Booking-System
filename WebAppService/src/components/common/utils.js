//Common functions can be placed here.
export function objectDeconstruct(parameters, obj) {
    const res = {}
    for (var i = 0; i < parameters.length; i++) {
        const currentKey = parameters[i]
        res[currentKey] = obj[currentKey];
    }
    return res;
}
 // const x = {
//     'x': 1,
//     'y':2,
//     'test': 3,
//     't': 0,
//     'z' : 'test'
// }
// // console.log(utils.objectDeconstruct(['test','t','a'],x ));