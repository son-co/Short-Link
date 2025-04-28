import asyncio
import aiohttp
import time
import random
import json
from datetime import datetime
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('shortlink_test.log'),
        logging.StreamHandler()
    ]
)

# 200
CONCURRENT_REQUESTS = 3000  # 每秒并发数
TEST_DURATION = 5  # 测试持续时间（秒）
BASE_URL = "https://lyl.la"  # 短链接服务地址

# 测试用的短链接列表
SHORT_LINKS = [
    "2mB9Md"  # 替换为实际的短链
]

class ShortLinkTester:
    def __init__(self):
        self.success_count = 0
        self.fail_count = 0
        self.total_requests = 0
        self.start_time = None
        self.end_time = None
        self.response_times = []
        self.error_types = {}

    async def make_request(self, session, short_link):
        start_time = time.time()
        try:
            url = f"{BASE_URL}/{short_link}"
            async with session.get(url, allow_redirects=False) as response:
                end_time = time.time()
                response_time = end_time - start_time
                self.response_times.append(response_time)

                if response.status == 302:  # 成功跳转
                    self.success_count += 1
                    logging.info(f"成功跳转: {short_link}, 响应时间: {response_time:.3f}秒")
                else:
                    self.fail_count += 1
                    error_type = f"HTTP_{response.status}"
                    self.error_types[error_type] = self.error_types.get(error_type, 0) + 1
                    logging.warning(f"跳转失败: {short_link}, 状态码: {response.status}, 响应时间: {response_time:.3f}秒")

        except Exception as e:
            self.fail_count += 1
            error_type = type(e).__name__
            self.error_types[error_type] = self.error_types.get(error_type, 0) + 1
            logging.error(f"请求异常: {short_link}, 错误: {str(e)}")

        self.total_requests += 1

    async def run_test(self):
        self.start_time = time.time()
        async with aiohttp.ClientSession() as session:
            while time.time() - self.start_time < TEST_DURATION:
                tasks = []
                for _ in range(CONCURRENT_REQUESTS):
                    short_link = random.choice(SHORT_LINKS)
                    tasks.append(self.make_request(session, short_link))
                await asyncio.gather(*tasks)
                await asyncio.sleep(1)  # 等待1秒后开始下一轮请求

        self.end_time = time.time()
        self.print_results()

    def print_results(self):
        total_time = self.end_time - self.start_time
        success_rate = (self.success_count / self.total_requests) * 100 if self.total_requests > 0 else 0
        avg_response_time = sum(self.response_times) / len(self.response_times) if self.response_times else 0
        max_response_time = max(self.response_times) if self.response_times else 0
        min_response_time = min(self.response_times) if self.response_times else 0

        results = {
            "测试开始时间": datetime.fromtimestamp(self.start_time).strftime('%Y-%m-%d %H:%M:%S'),
            "测试结束时间": datetime.fromtimestamp(self.end_time).strftime('%Y-%m-%d %H:%M:%S'),
            "总测试时长": f"{total_time:.2f}秒",
            "总请求数": self.total_requests,
            "成功请求数": self.success_count,
            "失败请求数": self.fail_count,
            "成功率": f"{success_rate:.2f}%",
            "平均响应时间": f"{avg_response_time:.3f}秒",
            "最大响应时间": f"{max_response_time:.3f}秒",
            "最小响应时间": f"{min_response_time:.3f}秒",
            "错误类型统计": self.error_types
        }

        logging.info("测试结果:")
        for key, value in results.items():
            logging.info(f"{key}: {value}")

        # 保存结果到文件
        with open('test_results.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    tester = ShortLinkTester()
    asyncio.run(tester.run_test()) 