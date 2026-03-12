import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// POST /api/recommend - AI 智能推荐
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preferences, history, mood } = body;
    
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const systemPrompt = `你是一个专业的影视娱乐推荐助手。你熟悉各种类型的电影、电视剧、动漫、漫画和小说。
你的任务是根据用户的喜好、观看历史和当前心情，推荐最适合他们的内容。

推荐时请考虑：
1. 用户的类型偏好
2. 观看历史中的评分模式
3. 当前心情（如轻松、刺激、感动等）
4. 是否考虑VIP内容
5. 推荐内容的多样性

请以JSON格式返回推荐结果，格式如下：
{
  "recommendations": [
    {
      "type": "movie|tv|anime|comic|novel",
      "title": "标题",
      "reason": "推荐理由",
      "match_score": 0-100
    }
  ],
  "mood_suggestion": "基于心情的建议"
}`;

    const userMessage = `请根据以下信息为我推荐内容：

用户偏好：${preferences || '无特定偏好'}
观看历史：${history || '暂无'}
当前心情：${mood || '一般'}

请推荐5-10个最合适的内容。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userMessage },
    ];

    const stream = client.stream(messages, {
      model: 'doubao-seed-1-6-flash-250615',
      temperature: 0.7,
    });

    // 收集流式响应
    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.content) {
        fullResponse += chunk.content.toString();
      }
    }

    // 尝试解析JSON
    let recommendations;
    try {
      // 提取JSON部分
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = { 
          recommendations: [],
          raw_response: fullResponse 
        };
      }
    } catch {
      recommendations = { 
        recommendations: [],
        raw_response: fullResponse 
      };
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('AI推荐失败:', error);
    return NextResponse.json(
      { error: '推荐服务暂时不可用' },
      { status: 500 }
    );
  }
}
