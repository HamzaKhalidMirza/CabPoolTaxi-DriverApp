export class DriverAppConfig {
    private static localPath = 'http://localhost:3000';
    private static hostPath = 'https://cabpool-ride.herokuapp.com';

    public static getLocalPath(): string {
        return DriverAppConfig.localPath;
    }

    public static getHostPath(): string {
        return DriverAppConfig.hostPath;
    }
}

// ../common/sdk/custom/api
