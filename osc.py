import sys
import socket
from config import ION_IP, ION_PORT


class OSCClient:

    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.settimeout(1.)

    def connect(self):
        self.s.connect((self.ip, self.port))

    def close(self):
        self.s.close()

    def send_msg(self, msg):
        out = bytearray(msg.encode('ascii'))
        self._pad_inplace(out)

        out_len = bytearray(len(out).to_bytes(4, 'big', signed=True))
        self.s.send(out_len + out)

    def recv_msg(self, osc_start):
        while True:
            data = self.s.recv(4)
            packet_len = int.from_bytes(data, byteorder='big', signed=True)
            data = self.s.recv(packet_len)
            if data[:len(osc_start)] == osc_start.encode('ascii'):
                return data

    @staticmethod
    def _pad_inplace(buffer):
        padding_len = 4 - len(buffer) % 4
        buffer.extend([0] * padding_len)


client = OSCClient(ION_IP, ION_PORT)

try:
    client.connect()
except (TimeoutError, ConnectionRefusedError):
    print('Connection Error')
    sys.exit(1)

client.send_msg('/eos/ping')
print(client.recv_msg('/eos/out/ping'))
client.close()
print('done')
