import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export class RequestNotFoundException extends NotFoundException {
  constructor() {
    super('Request not found');
  }
}

export class CompanyNotFoundException extends NotFoundException {
  constructor() {
    super('Company not found');
  }
}

export class InvitationNotFoundException extends NotFoundException {
  constructor() {
    super('Invitation not found');
  }
}
