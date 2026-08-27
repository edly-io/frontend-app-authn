import { getHttpClient } from '@edx/frontend-platform/auth';

import { resetPassword } from '../service';

jest.mock('@edx/frontend-platform/auth');

describe('resetPassword service', () => {
  const token = 'test-token';
  const payload = { new_password1: 'password123', new_password2: 'password123' };
  let post;

  beforeEach(() => {
    post = jest.fn().mockResolvedValue({ data: {} });
    getHttpClient.mockReturnValue({ post });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards track on the request URL when present in queryParams', async () => {
    await resetPassword(payload, token, { track: 'edly_panel' });

    const [calledUrl] = post.mock.calls[0];
    expect(calledUrl).toContain('track=edly_panel');
  });

  it('omits track from the request URL when absent from queryParams', async () => {
    await resetPassword(payload, token, {});

    const [calledUrl] = post.mock.calls[0];
    expect(calledUrl).not.toContain('track=');
  });
});
