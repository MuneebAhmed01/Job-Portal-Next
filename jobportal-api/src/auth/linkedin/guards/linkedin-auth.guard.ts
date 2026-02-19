import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LinkedInAuthGuard extends AuthGuard('linkedin') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    console.log('🔍 LinkedIn Guard - Request received:');
    console.log('   Path:', request.path);
    console.log('   Query params:', request.query);
    console.log('   Method:', request.method);
    console.log('   Headers:', request.headers);

    // If there's an error parameter, allow the request to pass through to controller
    if (request.query?.error) {
      console.log('   ✅ Error parameter detected, passing to controller');
      return true;
    }

    console.log('   🔄 Calling Passport authenticate...');

    // Let Passport handle state validation automatically
    return super.canActivate(context);
  }
}
