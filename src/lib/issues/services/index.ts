import { IssueService } from './issue-service';
import { IssueRepository } from '../repositories/issue-repository';
import { IssueHandler } from '../domain/handlers';

const repo = new IssueRepository();
const handler = new IssueHandler();

export const issueService = new IssueService(repo, handler);
