/*
> Tools/Functions.js 
> Little functions used across the project, in order to avoid spaghetti code
 */

/*
 Function that filter parent mesh's children by name, used filter to return muliple occurences

 * @param {Object} params - Options
 * @param {string} params.name - Name of the Mesh to find
 * @param {Mesh} params.parent - Mesh where to look for
 * @param {Boolean} params.strict - If true, returns only one occurence, if not, returns everything that matches the provided name

 */
export function getMesh(params) {
    if(params.parent.isMesh || params.parent.type === 'Group') {
        if(params.strict) return params.parent.children.find(item => item.name === params.name)
        else return params.parent.children.filter(item => item.name.includes(params.name))
    } 
    else {
        console.error('[Tools/Functions] Parent is not a Mesh or a Group')}
}
/* Function that return random number between min and max values passed as arguments */
export function Random(min,max) {
    return Math.random() * (max - min) + min;
}