@ECHO OFF
	echo Desplegando en local . . .
    echo Recuerda que debes copiar la URL de Forwarding en la URL del WebHook de DialogFlow
	start cmd /k ngrok http 8080 & npm-watch localDeploy