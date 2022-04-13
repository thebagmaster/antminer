const util = require('util')
const exec = util.promisify(require('child_process').exec)
const axios = require('axios')

const ips = [
        '192.168.1.46',
        '192.168.1.47',
        '192.168.1.48',
        '192.168.1.50',
        '192.168.1.49',
        '192.168.1.51',
        '192.168.1.53',
        '192.168.1.52',
        '192.168.1.54',
        '192.168.1.56',
        '192.168.1.55',
        '192.168.1.57',
        '192.168.1.58',
        '192.168.1.59',
        '192.168.1.61',
        '192.168.1.63',
        '192.168.1.62',
        '192.168.1.69',
        '192.168.1.64',
        '192.168.1.67',
        '192.168.1.65',
        '192.168.1.66',
        '192.168.1.68',
        '192.168.1.71',
//-----------------
        '192.168.2.49',
        '192.168.2.51',
        '192.168.2.52',
        '192.168.2.53',
        '192.168.2.55',
        '192.168.2.60',
        '192.168.2.61',
        '192.168.2.62',
        '192.168.2.63',
//-----------------
        '192.168.3.40',
        '192.168.3.43',
        '192.168.3.52',
        '192.168.3.53',
        '192.168.3.54',
        '192.168.3.55',
        '192.168.3.56',
        '192.168.3.57',
        '192.168.3.58',
        '192.168.3.68',
        '192.168.3.69',
        '192.168.3.70',
        '192.168.3.74',
        '192.168.3.76',
        '192.168.3.77',
        '192.168.3.78',
//--BTC^--LTC\/-----
        '192.168.3.80',
        '192.168.3.81',
        '192.168.3.82',
        '192.168.3.83',
        '192.168.3.84',
        '192.168.3.85',
        '192.168.3.86',
        '192.168.3.87',
        '192.168.3.88',
        '192.168.3.89',
        '192.168.3.90',
        '192.168.3.91',
        '192.168.3.92',
        '192.168.3.93',
        '192.168.3.94',
        '192.168.3.95',
        '192.168.3.96',
        '192.168.3.97',
        '192.168.3.98',
        '192.168.3.101',
        //-----------LTC 3-20 \/
        '192.168.3.102',
        '192.168.3.103',
        '192.168.3.105',
        '192.168.3.104',
        '192.168.3.106',
        '192.168.3.108',
        '192.168.3.107',
        '192.168.3.111',
        '192.168.3.109',
        '192.168.3.110',
        '192.168.3.112',
        '192.168.3.113',
        '192.168.3.114',
        '192.168.3.115',
        '192.168.3.116',
        '192.168.3.117',
        '192.168.3.118',
        '192.168.3.119',
]

const get = async (ip,cgi)=>{
        let rtn = {error:`error ip:${ip}`};
        try{
                const { stdout, stderr } = await exec(`curl -H 'Cache-Control: no-cache' --digest -s --user root:root http://${ip}/cgi-bin/${cgi}.cgi`)
                rtn = JSON.parse(stdout)
        } catch {}
        return rtn;
}

const parse = async (ip) => {
        const info = await get(ip, 'get_system_info')
        const stats = await get(ip, 'stats')
        if(info.error || stats.error){
                console.log(info,stats)
                return;
        }
        const {
                hostname
        } = info;
        const status = stats.STATUS.STATUS;
        const time = stats.STATUS.when;
        const s = stats.STATS[0];
        const uptime = s.elapsed;
        const hash = s.rate_avg;
        const ideal = s.rate_ideal;
        const unit = s.rate_unit;
        const fan = s.fan;
        let chain = [];
        for ( c of s.chain ){
                chain.push({
                        ideal:c.rate_ideal,
                        hash:c.rate_real,
                        freq:c.freq_avg,
                        temp_pcb:c.temp_pcb,
                        temp_chip:c.temp_chip,
                })
        }
        const miner = {
                hostname,
                status,
                time,
                uptime,
                hash,
                ideal,
                unit,
                fan,
                chain,
                date:new Date(),
                ip,
        };
        return miner;
}
