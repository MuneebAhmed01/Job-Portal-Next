import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LinkedInAuthGuard extends AuthGuard('linkedin') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // If there's an error parameter, allow the request to pass through to controller
    if (request.query?.error) {
      return true;
    }
    
    // If there's a code parameter, validate state before proceeding
    if (request.query?.code) {
      const state = request.query?.state;
      const storedState = request.cookies?.linkedin_oauth_state;
      
      // If state validation fails, we need to let it through to controller for proper error handling
      if (!state || !storedState || state !== storedState) {
        return true; // Let controller handle the invalid state error
      }
    }
    
    // Otherwise, proceed with normal LinkedIn authentication
    return super.canActivate(context);
  }
}
