const util = require('util')
const exec = util.promisify(require('child_process').exec)
const axios = require('axios')

const main = async ()=>{
        //try{
                const req = await axios('https://danserver.equipment/api/queryrestart')
                const rows = req.data.rows;
                for(let row of rows){
                        const { stdout, stderr } = await exec(`curl --digest --user 'root:root' http://${row.ip}/cgi-bin/reboot.cgi`)
                        console.log(`restarting ${row.ip} ${new Date()} ${stdout}`)
                }
        //} catch {}
}
main()
