import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    // super({
    //   secretOrKeyProvider: passportJwtSecret({
    //     cache: true,
    //     rateLimit: true,
    //     jwksRequestsPerMinute: 5,
    //     jwksUri: `https://dev-moxx54v2xb4s271o.us.auth0.com/.well-known/jwks.json`,
    //   }),
    //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   audience: 'http://localhost:3001',
    //   issuer: `https://dev-moxx54v2xb4s271o.us.auth0.com/`,
    //   algorithms: ['RS256'],
    // });
  }

  async validate(payload: unknown) {
    console.log('Token payload:', payload);

    return payload;
  }
}
