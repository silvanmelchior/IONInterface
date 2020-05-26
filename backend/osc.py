import struct
import socket


class OSCClient:

    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def connect(self, timeout=2):
        self.s.settimeout(timeout)
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
                # message
                idx = len(osc_start)
                while idx < len(data) and data[idx] != 0:
                    idx += 1
                msg = data[:idx].decode('ascii')

                # arguments
                while idx < len(data) and data[idx] != 44:
                    idx += 1
                if idx == len(data):
                    return msg, []
                else:
                    idx += 1
                    argstr_start = idx
                    while idx < len(data) and data[idx] != 0:
                        idx += 1
                    if idx == len(data) or argstr_start == idx:
                        return msg, []
                    argstr = data[argstr_start:idx].decode('ascii')
                    idx += 4 - idx % 4

                    args = []
                    for argtype in argstr:
                        if argtype == 'i':
                            args.append((argtype, int.from_bytes(data[idx:idx+4], byteorder='big', signed=True)))
                            idx += 4
                        elif argtype == 'f':
                            args.append((argtype, struct.unpack('>f', data[idx:idx+4])[0]))
                            idx += 4
                        elif argtype == 's':
                            str_start = idx
                            while idx < len(data) and data[idx] != 0:
                                idx += 1
                            args.append((argtype, data[str_start:idx].decode('ascii')))
                            idx += 4 - idx % 4
                        else:
                            args.append((argtype, None))

                    return msg, args

    def clr_cmd_line(self):
        self.send_msg('/eos/newcmd', '#')

    @staticmethod
    def _pad_inplace(buffer, always_pad=True):
        padding_len = 4 - len(buffer) % 4
        if not always_pad:
            if padding_len == 4:
                padding_len = 0
        buffer.extend([0] * padding_len)
