import axios from 'axios';
import pinyin from 'pinyin';

export default async function handler(req, res) {
    const { title, date, tags, draft, author, summary, content } = req.body;

    // 使用 pinyin 将中文转换为拼音
    const toPinyin = (str) => {
        return pinyin(str, {
            style: pinyin.STYLE_NORMAL, // 普通风格的拼音，没有音调
            heteronym: false // 禁用多音字模式
        }).flat().join('') // 将二维数组展开为一维，并将所有拼音连接成一个字符串
        .replace(/[^a-zA-Z0-9]+/g, '-') // 替换非字母和数字的字符为 "-"
        .replace(/^-+|-+$/g, '') // 移除开头和结尾的 "-"
        .toLowerCase(); // 转为小写
    };

    const fileName = toPinyin(title) + '.mdx';

    const fileContent = `---
title: '${title}'
date: '${date}'
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
draft: ${draft}
author: '${author}'
summary: '${summary}'
---

${content}
`;

    try {
        const response = await axios.put(
            `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/contents/${process.env.CONTENT_PATH}/${fileName}`,
            {
                message: `Add new blog post: ${title}`,
                content: Buffer.from(fileContent).toString('base64'),
            },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ message: 'Failed to create post' });
    }
}