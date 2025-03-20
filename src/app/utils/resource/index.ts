
export class Resource {
    session: Session = {}
    constructor(){
        this.setIP = this.setIP.bind(this)
    }
    setIP = (ip: string) => {
        this.session.IP = ip 
    }

    setUserAgent = (ua: string) => {
        this.session.userAgent = ua
    }

    setDeviceId = (deviceId: string) => {
        this.session.deviceId = deviceId
    }
    setUserId = (userId: string) => {
        this.session.userId = userId
    }
    setUsername = (username:string) => {
        this.session.username = username
    }    
}

export const resource = new Resource()

