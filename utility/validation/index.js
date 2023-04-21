const stringOperations=require("../stringOperation/index")

module.exports = {
    nullOrBlankAll: async function (res, reqBody, ...parametersToBeChecked) {
        try {
            for (let i = 0; i < parametersToBeChecked.length; i++) {
                if (reqBody[parametersToBeChecked[i]] == '' || reqBody[parametersToBeChecked[i]] == null) {
                    var errorField = await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                    res.status(400).send({
                        'success': false,
                        'message': "Please Enter Valid " + errorField,
                        'result': {},
                    })
                }
            }
        } catch {
            console.log("Here");
        }
    },
    nullOrBlankInternal: async function (value) {
        if (value == "" || value == null) {
            return 0
        } else {
            return 1;
        }
    },
};
