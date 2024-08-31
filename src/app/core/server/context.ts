import { AuthService } from "@/app/feature/auth/auth";
import { config } from "../../config";
import { AuthClient } from "@/app/feature/auth/service";
import { HttpService } from "@/app/utils/http/http-default";
import { getHTTPService } from "./http-config";

export class ApplicationContext {
  private authService?: AuthService;
  private httpService: HttpService;
  constructor(httpService: HttpService) {
    this.getAuthService = this.getAuthService.bind(this);
    this.httpService = httpService;
    this.getHttpService = this.getHttpService.bind(this);

  }

  getAuthService(): AuthService {
    if (!this.authService) {

      
      this.authService = new AuthClient(this.httpService, config.auth_url);
    }
    return this.authService;
  }

  getHttpService(): HttpService {
    if (!this.httpService) {
      this.httpService = new HttpService({
        timeout: 30000,
      });
    }
    return this.httpService;
  }
}

let context = new ApplicationContext(getHTTPService());

export const getApplicationContext = () => {
  if (!context) {
    context = new ApplicationContext(getHTTPService());
  }
  return context;
};

export const useAuthService = () => {
  return getApplicationContext().getAuthService();
};
