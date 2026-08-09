# mesh-chain

painlessMesh로 4대의 XIAO ESP32C6를 A -> B -> C -> D 순서로 잇는 릴레이 데모.
A 시리얼 모니터에 문자를 입력하면 B, C를 거쳐 D에 도착한다. 1~2대가 꺼져
있어도 살아있는 다음 노드를 자동으로 찾아서 건너뛰고, 다시 켜지면 별도
조작 없이 원래 경로로 복귀한다 (하트비트 기반, 5초 타임아웃).

## Install (teammates)

```bash
npx github:seeun92164-design/mesh-chain
```

현재 디렉토리에 `MeshChain/` 폴더로 설치된다 (경로를 인자로 주면 다른 곳에
설치 가능). Node.js만 있으면 되고, 실제 업로드에는 `arduino-cli`와 아래
라이브러리가 필요하다.

## 보드 설정

4대 모두 같은 `MeshChain.ino`를 쓰되, `#define MY_ROLE` 한 줄만 각자
`'A'`, `'B'`, `'C'`, `'D'`로 바꿔서 업로드한다.

```bash
arduino-cli compile --fqbn esp32:esp32:XIAO_ESP32C6 MeshChain
arduino-cli upload -p <포트> --fqbn esp32:esp32:XIAO_ESP32C6 MeshChain
```

필요 라이브러리 (전원 공통):

```bash
arduino-cli lib install "Painless Mesh"
arduino-cli lib install "Async TCP"
```

- `Painless Mesh`는 `ArduinoJson`, `TaskScheduler`를 의존성으로 같이 설치한다.
- `Async TCP`는 반드시 **ESP32Async가 관리하는 포크**를 설치해야 한다. 이름이
  비슷한 `AsyncTCP`(dvarrel 포크 등)는 더 이상 관리되지 않는 별개 라이브러리라
  쓰지 않는다.

## D 역할 (mesh <-> MQTT 브릿지)

D는 체인의 마지막 노드이면서, mesh에서 벌어지는 일(하트비트, 릴레이, 도착)을
MQTT로 흘려보내는 브릿지도 겸한다. D를 맡은 사람만 추가로:

```bash
arduino-cli lib install "PubSubClient"
cp mesh_secrets.h.example mesh_secrets.h
# mesh_secrets.h 안의 WIFI_SSID / WIFI_PASS / MQTT_HOST / MQTT_PORT 를 채운다
```

MQTT 브로커는 팀의 `grounding` 브로커(기본 `192.168.0.35:1883`)를 그대로
사용한다. D가 꺼져 있으면 A/B/C끼리는 계속 릴레이하지만 대시보드 업데이트는
멈춘다.

## 대시보드

`mesh-dashboard.html`을 브라우저로 그냥 열면 된다 (서버 불필요). 기본값은
`host=192.168.0.35&port=9001&prefix=grounding/mesh`이고, 다르면 쿼리 파라미터로
덮어쓴다:

```
mesh-dashboard.html?host=192.168.0.35&port=9001&prefix=grounding/mesh
```
