export default {
    NotExist: {
        errNum: 201,
        errCode: 'NotExist',
        message: "Something parameter doesn't exist",
    },
    AlreadyExists: {
        errNum: 202,
        errCode: 'AlreadyExists',
        message: 'Something parameter already exists',
    },
    Missing: {
        errNum: 203,
        errCode: 'Missing',
        message: 'Something parameter are missing',
    },
    Invalid: {
        errNum: 204,
        errCode: 'Invalid',
        message: 'Some parameter is invalid',
    },
    Duplicate: {
        errNum: 205,
        errCode: 'Duplicate',
        message: 'Some field is not unique',
    },

    NoFileUploaded: {
        errNum: 300,
        errCode: 'NoFileUploaded',
        message: 'No file uploaded',
        key: 'no_file_uploaded',
    },
    FileExtensionNotAllowed: {
        errNum: 301,
        errCode: 'FileExtensionNotAllowed',
        message: 'File extension is not allowed',
        key: 'file_extension_not_allowed',
    },
    FileTooLarge: {
        errNum: 302,
        errCode: 'FileTooLarge',
        message: 'File too large',
        key: 'file_too_large',
    },
};