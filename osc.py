import sys
import struct
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

    def send_msg(self, msg, *args):
        # message
        out = bytearray(msg.encode('ascii'))
        self._pad_inplace(out)

        # arguments
        if len(args) != 0:
            out.extend(b',')
            for arg in args:
                if type(arg) == int:
                    out.extend(b'i')
                elif type(arg) == float:
                    out.extend(b'f')
                elif type(arg) == str:
                    out.extend(b's')
                else:
                    raise ValueError
            self._pad_inplace(out)
            for arg in args:
                if type(arg) == int:
                    out.extend(arg.to_bytes(4, 'big', signed=True))
                elif type(arg) == float:
                    out.extend(struct.pack('>f', arg))
                elif type(arg) == str:
                    arg_bytes = bytearray(arg.encode('ascii'))
                    arg_bytes.append(0)
                    self._pad_inplace(arg_bytes, always_pad=False)
                    out.extend(arg_bytes)
                else:
                    raise ValueError

        # length
        print('OUT', out)
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
    def _pad_inplace(buffer, always_pad=True):
        padding_len = 4 - len(buffer) % 4
        if not always_pad:
            if padding_len == 4:
                padding_len = 0
        buffer.extend([0] * padding_len)


client = OSCClient(ION_IP, ION_PORT)

try:
    client.connect()
except (TimeoutError, ConnectionRefusedError):
    print('Connection Error')
    sys.exit(1)

client.send_msg('/eos/ping')
print(client.recv_msg('/eos/out/ping'))

client.send_msg('/eos/ping', 5, 8., 'asdf')
print(client.recv_msg('/eos/out/ping'))

client.close()
