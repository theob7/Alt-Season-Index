import {InfluxDB} from "@influxdata/influxdb-client";
import {Point} from "@influxdata/influxdb-client";

let client;

export function initClient(url, token) {
    url = url;
    token = token;
    client = new InfluxDB({url: url, token});
}

export async function writeData(org, bucket, pointName, name, value) {
    let newData = new Point(pointName).floatField(name, value)
    let writeApi = client.getWriteApi(org, bucket);
    writeApi.writePoint(newData);

    await writeApi.close().then(() => { /*console.log('FINISHED')*/ }).catch(e => { console.error(e) })
}
