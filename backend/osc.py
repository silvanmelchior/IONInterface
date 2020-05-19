import sys
import struct
import socket
from config import ION_IP, ION_PORT


class OSCClient:

    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def connect(self):
        self.s.connect((self.ip, self.port))
        self.clr_cmd_line()

    def close(self):
        self.clr_cmd_line()
        self.recv_msg('/dummy', timeout=0.1)
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
        out_len = bytearray(len(out).to_bytes(4, 'big', signed=True))
        self.s.send(out_len + out)

    def recv_msg(self, osc_start, timeout=1.):
        self.s.settimeout(timeout)
        while True:
            try:
                data = self.s.recv(4)
            except socket.timeout:
                return None
            packet_len = int.from_bytes(data, byteorder='big', signed=True)
            data = self.s.recv(packet_len)
            if data[:len(osc_start)] == osc_start.encode('ascii'):
                return data

    def clr_cmd_line(self):
        self.send_msg('/eos/newcmd', '#')

    @staticmethod
    def _pad_inplace(buffer, always_pad=True):
        padding_len = 4 - len(buffer) % 4
        if not always_pad:
            if padding_len == 4:
                padding_len = 0
        buffer.extend([0] * padding_len)


#
# Test Code
#
client = OSCClient(ION_IP, ION_PORT)

try:
    client.connect()
except (TimeoutError, ConnectionRefusedError):
    print('Connection Error')
    sys.exit(1)


# ping
# client.send_msg('/eos/ping')
# print(client.recv_msg('/eos/out/ping'))
# client.send_msg('/eos/ping', 5, 8., 'asdf')
# print(client.recv_msg('/eos/out/ping'))


# channel
# client.send_msg('/eos/chan/3/full')
# client.send_msg('/eos/chan/3/out')
# client.send_msg('/eos/chan/3', 50)
# client.send_msg('/eos/chan/71/param/red', 85)
# for chan in [1, 4, 70, 20, 110]:
#     client.send_msg('/eos/chan', chan)
#     ans = None
#     while True:
#         ans_ = client.recv_msg('/eos/out/active/chan', timeout=0.5)
#         if ans_ is None:
#             break
#         ans = ans_
#     print(chan, ans)
#     client.clr_cmd_line()


# sub
# client.send_msg('/eos/sub/2', 0.75)
# client.send_msg('/eos/get/sub/count')
# print(client.recv_msg('/eos/out/get/sub/count'))
# for i in range(5):
#     client.send_msg(f'/eos/get/sub/index/{i}')
#     while True:
#         ret = '/eos/out/get/sub'
#         ans = client.recv_msg(ret)
#         if ans[len(ret)+1:].decode('ascii').split('/')[1] == 'list':  # TODO: might not be able to decode, will need answer from recv-function
#             break
#     print(ans)


# cue
# client.send_msg('/eos/cue/fire', 100.5)
# print(client.recv_msg('/eos/out/active/cue'))
# client.send_msg('/eos/key/go_0')
# client.send_msg('/eos/key/stop')
# client.send_msg('/eos/get/cue/1/count')
# print(client.recv_msg('/eos/out/get/cue/1/count'))


# close
client.close()
