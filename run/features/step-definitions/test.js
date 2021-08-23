const { exec } = require("child_process");

exec("cd C:/Users/AlyssaMcMillan/Downloads && del /f download*", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

