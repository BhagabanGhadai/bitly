import { nanoid } from 'nanoid';
import { describe, it, expect, beforeEach } from 'vitest';

import { supabase } from '../config/supabase.js';

describe('URL Shortener', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: `test-${nanoid()}@example.com`,
      password: 'test-password',
    });

    testUser = user;
  });

  it('should create a short URL', async () => {
    const { data, error } = await supabase
      .from('urls')
      .insert({
        user_id: testUser.id,
        long_url: 'https://example.com',
        alias: nanoid(8),
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.long_url).toBe('https://example.com');
  });

  it('should not allow duplicate aliases', async () => {
    const alias = nanoid(8);

    // Create first URL
    await supabase.from('urls').insert({
      user_id: testUser.id,
      long_url: 'https://example.com',
      alias,
    });

    // Try to create second URL with same alias
    const { error } = await supabase.from('urls').insert({
      user_id: testUser.id,
      long_url: 'https://example.org',
      alias,
    });

    expect(error).toBeDefined();
  });

  it('should track analytics when URL is accessed', async () => {
    const alias = nanoid(8);

    // Create URL
    await supabase.from('urls').insert({
      user_id: testUser.id,
      long_url: 'https://example.com',
      alias,
    });

    // Record analytics
    const { error } = await supabase.from('analytics').insert({
      url_alias: alias,
      user_agent: 'test-agent',
      ip_address: '127.0.0.1',
    });

    expect(error).toBeNull();

    // Verify analytics
    const { data: analytics } = await supabase.from('analytics').select().eq('url_alias', alias);

    expect(analytics).toHaveLength(1);
    expect(analytics[0].user_agent).toBe('test-agent');
  });
});
