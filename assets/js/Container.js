/**
 * Created by fopi on 2016.02.28..
 */
function MyContainer() {
    var definitions = {};
    return {
        set: function (name, value) {
            definitions[name] = value;
        },
        get: function (name) {
            return definitions[name];
        }
    }
}